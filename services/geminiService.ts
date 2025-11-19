
import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Question, QuestionType, Candidate, Assessment, AIAnalysis, AIProvider } from '../types';

// --- KEY MANAGEMENT ---

const getKeys = () => {
  // Priority: LocalStorage (Runtime Config) -> Environment Variables
  const openAI = localStorage.getItem('TBL_OPENAI_KEY') || process.env.OPENAI_API_KEY || process.env.REACT_APP_OPENAI_KEY;
  const gemini = localStorage.getItem('TBL_GEMINI_KEY') || process.env.API_KEY || process.env.REACT_APP_GEMINI_KEY;
  
  return {
    OPENAI_API_KEY: openAI,
    GEMINI_API_KEY: gemini,
    HAS_OPENAI: !!openAI,
    HAS_GEMINI: !!gemini
  };
};

const modelName = 'gemini-2.5-flash';

// Lazy initialization
let aiInstance: GoogleGenAI | null = null;

const getGeminiClient = () => {
  const { GEMINI_API_KEY } = getKeys();
  // Always recreate if key changes or doesn't exist
  if (GEMINI_API_KEY) {
    aiInstance = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return aiInstance;
};

// --- ADAPTER LAYER ---

/**
 * Calls OpenAI API via fetch to avoid adding npm dependencies.
 * Adapts the Gemini-style schema to a system prompt instruction for JSON mode.
 */
const callOpenAI = async (prompt: string, schema: any, temperature: number) => {
  const { OPENAI_API_KEY } = getKeys();
  if (!OPENAI_API_KEY) throw new Error("OpenAI Key missing");

  const systemPrompt = `
    You are a strict JSON-outputting AI engine.
    You must respond with valid JSON that adheres strictly to the following schema structure:
    ${JSON.stringify(schema, null, 2)}
    
    Do not include markdown formatting (like \`\`\`json). Just the raw JSON object.
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Mapping generic request to GPT-4o
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: temperature,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Call Failed:", error);
    throw error;
  }
};

/**
 * Central Dispatcher that routes to the available or selected AI Provider.
 */
const dispatchAI = async (
  prompt: string, 
  schema: any, 
  config: { temperature: number, provider?: AIProvider }
): Promise<any> => {
  const { HAS_GEMINI, HAS_OPENAI } = getKeys();
  
  // Determine Default Provider dynamically based on available keys
  const currentDefault = (!HAS_GEMINI && HAS_OPENAI) ? AIProvider.OPENAI_GPT4 : AIProvider.GOOGLE_GEMINI;
  const targetProvider = config.provider || currentDefault;

  // Try OpenAI if selected or if it's the only one available
  if (targetProvider === AIProvider.OPENAI_GPT4 || (!HAS_GEMINI && HAS_OPENAI)) {
    try {
      console.log("[AI Service] Routing to OpenAI...");
      const text = await callOpenAI(prompt, schema, config.temperature);
      return JSON.parse(text);
    } catch (e) {
      console.warn("OpenAI failed. Trying fallback to Gemini if available.");
      if (!HAS_GEMINI) throw e; // No fallback
    }
  }

  // Default: Gemini
  try {
    const ai = getGeminiClient();
    if (!ai) throw new Error("Gemini Client could not be initialized (Missing Key?)");
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: config.temperature,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    return JSON.parse(text);

  } catch (error) {
    // If Gemini fails and we have OpenAI, try fallback
    if (HAS_OPENAI && targetProvider !== AIProvider.OPENAI_GPT4) {
        console.log("[AI Service] Gemini failed. Fallback to OpenAI...");
        const text = await callOpenAI(prompt, schema, config.temperature);
        return JSON.parse(text);
    }
    throw error;
  }
};


// --- EXPORTED SERVICES ---

export const generateAssessmentContent = async (
  language: string,
  framework: string,
  difficulty: Difficulty,
  topics: string[],
  questionCount: number
) => {
  const prompt = `
  Actúa como un Arquitecto de Software Principal creando una evaluación técnica en ESPAÑOL para un desarrollador ${difficulty} de ${language} usando ${framework}.
  Temas: ${topics.join(', ')}.
  
  Debes generar EXACTAMENTE ${questionCount} preguntas variadas utilizando ESTRICTAMENTE los siguientes tipos de preguntas (mezcla al menos 4 tipos diferentes):

  1. "Multiple Choice": Pregunta de opción múltiple.
  2. "Drag & Drop" o "Reorder Steps": Lista de pasos a ordenar.
  3. "Fill-in-the-Blank": Frase con huecos {{__}}.
  4. "Hotspot Code": Código con error a identificar.
  5. "Lab-Based": Ejercicio de codificación.
  6. "Case Study": Problema de arquitectura.
  7. "Yes/No": Binaria.
  8. "Best Answer": Mejor alternativa.

  IMPORTANTE:
  - Idioma: ESPAÑOL.
  - Para "Fill-in-the-Blank", usa "{{__}}".
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { 
              type: Type.STRING, 
              enum: [
                'Multiple Choice', 'Drag & Drop', 'Case Study', 'Hot Area', 
                'Hotspot Code', 'Reorder Steps', 'Best Answer', 'Yes/No', 
                'Repeated Answers', 'Lab-Based', 'Fill-in-the-Blank', 'Scenario Multi-step'
              ] 
            },
            text: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctOptionIndices: { type: Type.ARRAY, items: { type: Type.INTEGER } },
            correctOptionIndex: { type: Type.INTEGER },
            correctOrder: { type: Type.ARRAY, items: { type: Type.STRING } },
            starterCode: { type: Type.STRING },
            topic: { type: Type.STRING },
            blanks: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['type', 'text', 'topic']
        }
      }
    },
    required: ['questions']
  };

  return await dispatchAI(prompt, schema, { temperature: 0.85 });
};

export const refineQuestionWithAI = async (
  originalQuestion: Question,
  instruction: string
): Promise<Question> => {
  const prompt = `
  Refina esta pregunta técnica basada en la instrucción.
  Pregunta Original: ${JSON.stringify(originalQuestion)}
  Instrucción: "${instruction}"
  
  Devuelve el objeto Question actualizado en JSON.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING },
        text: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctOptionIndex: { type: Type.INTEGER },
        correctOptionIndices: { type: Type.ARRAY, items: { type: Type.INTEGER } },
        starterCode: { type: Type.STRING },
        topic: { type: Type.STRING },
        correctOrder: { type: Type.ARRAY, items: { type: Type.STRING } },
        blanks: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['type', 'text']
  };

  try {
    const newQ = await dispatchAI(prompt, schema, { temperature: 0.9 });
    return { ...newQ, id: originalQuestion.id };
  } catch (error) {
    console.error("Error refining question", error);
    return originalQuestion;
  }
};

export const gradeSubmissionWithAI = async (
  answersRaw: any,
  language: string,
  assessmentContext?: any
): Promise<AIAnalysis> => {
  const { HAS_GEMINI, HAS_OPENAI } = getKeys();
  // Default to Gemini 2.5 if available, otherwise GPT-4o
  const currentDefault = (!HAS_GEMINI && HAS_OPENAI) ? AIProvider.OPENAI_GPT4 : AIProvider.GOOGLE_GEMINI;

  const questionsContext = assessmentContext?.questions.map((q: any) => ({
      id: q.id,
      text: q.text,
      type: q.type,
      correctAnswerInfo: q.correctOptionIndex ?? q.correctOrder ?? "Open ended"
  }));

  const prompt = `
  Eres "Avalia", un Agente de Evaluación Técnica Autónoma (AI Technical Recruiter) para el Tech Battle Latam.
  
  TU OBJETIVO:
  Analizar las respuestas de un candidato para determinar si debe ser contratado.
  NO inventes información. Usa SOLO la evidencia provista en 'Respuestas del Candidato'.
  
  DATOS DE LA PRUEBA:
  Lenguaje: ${language}
  Preguntas: ${JSON.stringify(questionsContext)}

  RESPUESTAS DEL CANDIDATO (EVIDENCIA):
  ${JSON.stringify(answersRaw)}

  CRITERIOS ESTRICTOS DE EVALUACIÓN (Avalia Protocol):
  1. **Seguridad (Critical)**: Escanea cualquier código en busca de vulnerabilidades (SQLi, XSS, Inseguridad de memoria). Si encuentras algo, repórtalo en 'detectedIssues' y baja el 'securityScore'.
  2. **Performance (Big O)**: Si el código tiene bucles anidados innecesarios (O(n^2)), penaliza el 'performanceScore'.
  3. **Seniority**: Evalúa si el uso del lenguaje corresponde a un Junior, Mid o Senior.
  4. **Decisión de Contratación**: Basado en lo anterior, emite una recomendación final.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER, description: "Puntaje 0-100 basado en corrección técnica." },
      summary: { type: Type.STRING, description: "Reporte narrativo del perfil técnico." },
      hiringRecommendation: { 
        type: Type.STRING, 
        enum: ['Strong Hire', 'Hire', 'Weak Hire', 'No Hire'],
        description: "Decisión vinculante basada en la calidad del código."
      },
      codeQuality: { type: Type.INTEGER, description: "0-100" },
      problemSolving: { type: Type.INTEGER, description: "0-100" },
      theoreticalKnowledge: { type: Type.INTEGER, description: "0-100" },
      bestPractices: { type: Type.INTEGER, description: "0-100" },
      securityScore: { type: Type.INTEGER, description: "0-100. Penaliza fuertemente vulnerabilidades." },
      performanceScore: { type: Type.INTEGER, description: "0-100. Penaliza ineficiencia algorítmica." },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      detectedIssues: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Lista específica de errores técnicos, bugs o fallos de seguridad encontrados en el código del candidato."
      },
      levelEstimated: { type: Type.STRING, description: "Junior, Mid-Level, Senior, Principal" },
      modelSignature: { type: Type.STRING, description: "Firma del modelo evaluador" }
    },
    required: ['score', 'summary', 'hiringRecommendation', 'securityScore', 'performanceScore', 'detectedIssues']
  };

  try {
    // For Grading, we prefer consistency, so low temperature
    const analysis = await dispatchAI(prompt, schema, { temperature: 0.2 });
    
    analysis.modelSignature = currentDefault === AIProvider.OPENAI_GPT4
        ? "Avalia (Powered by GPT-4o)" 
        : "Avalia (Powered by Gemini 2.5)";

    return analysis;
  } catch (error) {
    console.error("Error grading:", error);
    return {
      score: 0,
      summary: "Error de conexión con el Agente Avalia. Verifica tu API Key en Configuración.",
      hiringRecommendation: 'No Hire',
      codeQuality: 0,
      problemSolving: 0,
      theoreticalKnowledge: 0,
      bestPractices: 0,
      securityScore: 0,
      performanceScore: 0,
      strengths: [],
      weaknesses: [],
      detectedIssues: ["System Failure"],
      levelEstimated: "Unknown"
    };
  }
};

// --- ORCHESTRATOR AGENT FUNCTIONS ---

export const selectAssessmentForCandidate = async (
  candidate: Candidate,
  assessments: Assessment[]
): Promise<string | null> => {
  const assessmentList = assessments.map(a => ({
    id: a.id,
    code: a.serialCode,
    title: a.title,
    language: a.language,
    difficulty: a.difficulty,
    topics: a.topics.join(', ')
  }));

  const prompt = `
  SYSTEM PROMPT (Agente Orquestador):
  Tu función es orquestar todo el proceso de evaluación técnica del candidato.
  
  DATOS DEL CANDIDATO:
  Nombre: ${candidate.name}
  Rol: ${candidate.role || 'No especificado'}
  Nivel: ${candidate.experienceLevel || 'No especificado'}
  Codigo Serial (Linked): ${candidate.linkedSerialCode || 'Ninguno'}

  LISTA DE PRUEBAS DISPONIBLES:
  ${JSON.stringify(assessmentList)}

  Regla 1: Si el candidato tiene un 'Codigo Serial' y coincide con una prueba, selecciona esa prueba inmediatamente.
  Regla 2: Si no, busca la prueba más adecuada por rol y nivel.

  Tarea: Devuelve el ID de la prueba seleccionada. Si ninguna es adecuada, devuelve null.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      selectedAssessmentId: { type: Type.STRING, description: "El ID de la prueba seleccionada o null." },
      reason: { type: Type.STRING, description: "Breve justificación de la elección para el log del sistema." }
    },
    required: ['selectedAssessmentId', 'reason']
  };

  try {
    const result = await dispatchAI(prompt, schema, { temperature: 0.1 });
    console.log(`Orchestrator assigned: ${result.selectedAssessmentId} (${result.reason})`);
    return result.selectedAssessmentId;
  } catch (error) {
    console.error("Orchestrator selection failed:", error);
    return null;
  }
};

export const analyzeCandidateProfile = async (
    candidate: Candidate
  ): Promise<{ language: string, framework: string, difficulty: Difficulty, topics: string[] }> => {
    const prompt = `
      Eres el "Agente Arquitecto". Tu tarea es analizar el perfil de un candidato y definir los parámetros técnicos para generar una prueba de programación a medida.
      
      Candidato: ${candidate.role} 
      Nivel reportado: ${candidate.experienceLevel}
      
      Deduce lo siguiente:
      - language (ej. Java, Python, JavaScript, C#, Go). Si no es claro, usa JavaScript.
      - framework (ej. Spring Boot, React, .NET Core). Si no es claro, usa 'Standard Library'.
      - difficulty (Debe ser uno de: 'Junior', 'Mid-Level', 'Senior', 'Principal/Expert').
      - topics (Array de 3-5 temas técnicos relevantes para ese rol específico).
    `;
  
    const schema = {
      type: Type.OBJECT,
      properties: {
        language: { type: Type.STRING },
        framework: { type: Type.STRING },
        difficulty: { type: Type.STRING, enum: [Difficulty.JUNIOR, Difficulty.MID, Difficulty.SENIOR, Difficulty.EXPERT] },
        topics: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['language', 'framework', 'difficulty', 'topics']
    };
  
    try {
      return await dispatchAI(prompt, schema, { temperature: 0.2 });
    } catch (e) {
      console.error("Architect Agent failed", e);
      return {
          language: 'JavaScript',
          framework: 'Standard Library',
          difficulty: Difficulty.MID,
          topics: ['Algorithms', 'Logic', 'Problem Solving']
      };
    }
  };

export const adjudicateCandidateResult = async (
  analysis: AIAnalysis
): Promise<'APPROVED' | 'REJECTED'> => {
  const prompt = `
  SYSTEM PROMPT (Agente Orquestador - Fase Cierre):
  Tu función es TOMAR LA DECISIÓN FINAL basada en el reporte del agente evaluador (Avalia).
  
  INPUT (REPORTE TÉCNICO AVALIA):
  Score: ${analysis.score}/100
  Recomendación: ${analysis.hiringRecommendation}
  Nivel Estimado: ${analysis.levelEstimated}
  Seguridad: ${analysis.securityScore}

  REGLAS DE DECISIÓN:
  - 'Strong Hire' -> APPROVED
  - 'Hire' -> APPROVED (Solo si Score > 60)
  - 'Weak Hire' -> REJECTED
  - 'No Hire' -> REJECTED
  - Fallo de Seguridad (< 50 pts) -> REJECTED AUTOMÁTICO (Veto técnico).
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      finalStatus: { type: Type.STRING, enum: ['APPROVED', 'REJECTED'] },
      reason: { type: Type.STRING }
    },
    required: ['finalStatus']
  };

  try {
    const result = await dispatchAI(prompt, schema, { temperature: 0 });
    return result.finalStatus;
  } catch (e) {
    console.error("Orchestrator adjudication failed", e);
    return 'REJECTED';
  }
};
