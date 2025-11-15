import { GoogleGenAI, Type } from "@google/genai";
import { ClientData, FileData, Diagnosis, Proposals, FinalReport, ProposalPath, Initiative } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const diagnosisSchema = {
    type: Type.OBJECT,
    properties: {
        mainPainPoint: { type: Type.STRING, description: 'Una declaración clara, específica y concisa del problema más crítico del cliente.' },
        secondaryPainPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Una lista de 3 a 4 problemas relacionados pero menos críticos que enfrenta el cliente.' },
        insights: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Una lista de observaciones clave o conclusiones no obvias derivadas de la información proporcionada.' },
        findings: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Una lista de descubrimientos fácticos realizados al analizar el problema y el contexto del cliente.' },
    },
    required: ['mainPainPoint', 'secondaryPainPoints', 'insights', 'findings']
};

const initiativeSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        benefit: { type: Type.STRING },
        kpis: { type: Type.ARRAY, items: { type: Type.STRING } },
        investment: { type: Type.STRING, description: "Ej: 'Baja', 'Media', 'Alta'" }
    },
    required: ['title', 'description', 'benefit', 'kpis', 'investment']
};

const proposalsSchema = {
    type: Type.OBJECT,
    properties: {
        shortTerm: {
            type: Type.ARRAY,
            description: "Victorias rápidas. 2-3 iniciativas realizables en menos de 3 meses.",
            items: initiativeSchema
        },
        mediumTerm: {
            type: Type.ARRAY,
            description: "Mejoras estructurales. 2-3 iniciativas para los próximos 3-9 meses.",
            items: initiativeSchema
        },
        longTerm: {
            type: Type.ARRAY,
            description: "Metas de transformación. 2-3 iniciativas para más de 9 meses.",
            items: initiativeSchema
        },
    },
    required: ['shortTerm', 'mediumTerm', 'longTerm']
};

const detailedInitiativeSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        actionableSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de 3-5 pasos claros y secuenciales para implementar la iniciativa." },
        potentialRisks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de 2-3 riesgos probables que podrían surgir." },
        mitigationStrategies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de estrategias concretas para abordar cada riesgo potencial." },
        kpis: { type: Type.ARRAY, items: { type: Type.STRING } },
        requiredRoles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de los roles o perfiles de equipo necesarios (ej: 'Líder de Proyecto', 'Desarrollador Backend')." }
    },
    required: ['title', 'description', 'actionableSteps', 'potentialRisks', 'mitigationStrategies', 'kpis', 'requiredRoles']
};

const finalReportSchema = {
    type: Type.OBJECT,
    properties: {
        executiveSummary: { type: Type.STRING, description: "Un resumen de alto nivel para directivos, que cubra el problema, la solución seleccionada y los resultados esperados. Debe ser conciso e impactante." },
        detailedRoadmap: { type: Type.ARRAY, items: detailedInitiativeSchema, description: "La hoja de ruta detallada con el desglose completo de cada iniciativa." },
        commercialRecommendation: { type: Type.STRING, description: "Una declaración final que enmarque la solución seleccionada como una inversión valiosa y sugiera los próximos pasos para la colaboración." }
    },
    required: ['executiveSummary', 'detailedRoadmap', 'commercialRecommendation']
};

export const generateDiagnosis = async (clientData: ClientData, problemDescription: string, fileData?: FileData): Promise<Diagnosis> => {
    const prompt = `
      Analiza el siguiente problema de negocio para un cliente y genera un diagnóstico estructurado.

      **Contexto del Cliente:**
      - Nombre de la Empresa: ${clientData.companyName}
      - Industria: ${clientData.industry}
      - Tamaño de la Empresa: ${clientData.companySize}

      **Descripción del Problema del Cliente:**
      "${problemDescription}"

      **Tarea de Análisis:**
      Basado en toda la información proporcionada, incluido el documento adjunto si lo hay, identifica los problemas centrales.
      Proporciona una salida JSON estructurada con el punto de dolor principal, puntos de dolor secundarios, ideas clave y hallazgos fácticos.
      Sé específico y evita la jerga empresarial genérica. El análisis debe ser agudo y accionable.
    `;
    
    const contents = fileData 
      ? { parts: [{ text: prompt }, { inlineData: { mimeType: fileData.type, data: fileData.content } }] }
      : prompt;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
            responseMimeType: 'application/json',
            responseSchema: diagnosisSchema
        }
    });

    return JSON.parse(response.text);
};

export const generateProposals = async (diagnosis: Diagnosis): Promise<Proposals> => {
    const prompt = `
      Basado en el siguiente diagnóstico, desarrolla un conjunto de propuestas estratégicas organizadas en horizontes a corto, mediano y largo plazo.

      **Diagnóstico Proporcionado:**
      - Punto de Dolor Principal: ${diagnosis.mainPainPoint}
      - Puntos de Dolor Secundarios: ${diagnosis.secondaryPainPoints.join(', ')}
      - Ideas Clave: ${diagnosis.insights.join(', ')}

      **Tarea:**
      Para cada horizonte de tiempo (corto, mediano, largo), crea 2-3 iniciativas distintas y accionables.
      Cada iniciativa debe tener un título, descripción, beneficio clave, 2-3 KPIs medibles y un nivel de inversión estimado (Baja, Media, Alta).
      Las propuestas deben abordar directamente el diagnóstico.
      Devuelve el resultado como un objeto JSON estructurado.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: proposalsSchema
        }
    });

    return JSON.parse(response.text);
};

export const editSingleInitiative = async (diagnosis: Diagnosis, currentInitiative: Initiative, editPrompt: string): Promise<Initiative> => {
    const prompt = `
      Eres un consultor estratégico de IA. Tu tarea es editar una ÚNICA iniciativa estratégica basándote en una solicitud específica del usuario.

      **Diagnóstico Original (Para Contexto General):**
      ${JSON.stringify(diagnosis, null, 2)}

      **Iniciativa Específica a Editar:**
      ${JSON.stringify(currentInitiative, null, 2)}

      **Solicitud de Edición del Usuario:**
      "${editPrompt}"

      **Tarea:**
      Revisa y reescribe la **Iniciativa Específica a Editar** para incorporar la solicitud del usuario. Tu respuesta debe ser una versión mejorada de ESTA ÚNICA iniciativa.
      Por ejemplo, si el usuario pide alternativas a una herramienta, debes actualizar el título y la descripción para reflejar la nueva herramienta o enfoque. Si pide más detalles, enriquece la descripción.
      Mantén la estructura del objeto de la iniciativa (title, description, benefit, kpis, investment).
      Devuelve SÓLO el objeto JSON de la iniciativa actualizada.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: initiativeSchema
        }
    });

    return JSON.parse(response.text);
}

export const generateFinalReport = async (diagnosis: Diagnosis, proposals: Proposals, selectedPath: ProposalPath): Promise<FinalReport> => {
    const selectedProposals = proposals[selectedPath];
    const pathName = {
        shortTerm: "Corto Plazo",
        mediumTerm: "Mediano Plazo",
        longTerm: "Largo Plazo"
    }[selectedPath];

    const prompt = `
      Eres un experto Consultor de Gestión y Tecnología. Tu tarea es transformar una propuesta estratégica de alto nivel en un plan de implementación detallado y procesable.

      **Diagnóstico del Cliente:**
      ${JSON.stringify(diagnosis, null, 2)}

      **Propuesta Estratégica SELECCIONADA (${pathName}):**
      ${JSON.stringify(selectedProposals, null, 2)}

      **Tarea Principal: Detallar la Hoja de Ruta**
      Para CADA una de las iniciativas en la propuesta seleccionada, debes generar un desglose detallado. Expande cada iniciativa en los siguientes componentes:
      1.  **actionableSteps**: Una lista de 3-5 pasos claros, secuenciales y concretos para implementar la iniciativa.
      2.  **potentialRisks**: Una lista de 2-3 riesgos probables que podrían obstaculizar la implementación.
      3.  **mitigationStrategies**: Una lista de estrategias concretas para abordar cada riesgo potencial que identificaste.
      4.  **requiredRoles**: Una lista de los roles o perfiles de equipo necesarios para ejecutar la iniciativa (ej: 'Líder de Proyecto', 'Analista de Datos', 'Especialista en Capacitación').
      5.  Conserva los campos originales 'title', 'description' y 'kpis'.

      **Tareas Secundarias: Sintetizar el Informe**
      Después de detallar la hoja de ruta, realiza lo siguiente:
      1.  **executiveSummary**: Escribe un resumen conciso y de alto nivel para una audiencia de nivel C. Debe resumir el problema central, la solución detallada para el horizonte de **${pathName}** y el impacto esperado.
      2.  **commercialRecommendation**: Escribe un párrafo final que posicione este plan detallado como una oportunidad de asociación estratégica y sugiera el siguiente paso inmediato.

      Devuelve todo como un único objeto JSON estructurado que coincida con el esquema proporcionado. El resultado debe ser profesional, detallado y de alto valor.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: finalReportSchema
        }
    });
    
    return JSON.parse(response.text);
};