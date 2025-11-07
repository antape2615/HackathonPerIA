import { GoogleGenerativeAI } from '@google/generative-ai'

class GeminiService {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  }

  async analyzeAssessment(responses: any) {
    try {
      const prompt = `
        Eres un consultor experto en transformación digital. Analiza la siguiente información de assessment y proporciona un análisis detallado.

        Información del Cliente:
        - Empresa: ${responses.company}
        - Industria: ${responses.industry}
        - Tamaño: ${responses.size}
        - Desafíos actuales: ${responses.currentChallenges.join(', ')}
        - Madurez digital: ${responses.digitalMaturity}
        - Presupuesto: ${responses.budget}
        - Timeline: ${responses.timeline}
        - Prioridades: ${responses.priorities.join(', ')}

        Proporciona un análisis estructurado en formato JSON que incluya:
        
        {
          "painPoints": [
            { "title": "string", "priority": "Alta|Media|Baja", "impact": "string", "category": "string" }
          ],
          "solutions": {
            "shortTerm": [{ "title": "string", "cost": "number (costo promedio en USD para Latam)", "roi": "number", "duration": "string" }],
            "mediumTerm": [{ "title": "string", "cost": "number (costo promedio en USD para Latam)", "roi": "number", "duration": "string" }],
            "longTerm": [{ "title": "string", "cost": "number (costo promedio en USD para Latam)", "roi": "number", "duration": "string" }]
          },
          "analytics": {
            "averageROI": "number",
            "timeSaved": "number",
            "efficiency": { "current": "number", "projected": "number", "improvement": "number" }
          },
          "recommendations": [
            { "title": "string", "category": "Estratégica|Operativa|Tecnológica" }
          ]
        }
      `
      
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
        throw new Error('Invalid JSON response from Gemini')
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError)
        throw new Error('Error processing AI analysis')
      }
    } catch (error) {
      console.error('Gemini analysis error:', error)
      // Return fallback analysis if Gemini fails
      return {
        painPoints: [
          {
            title: 'Procesos manuales ineficientes',
            priority: 'Alta',
            impact: '85%',
            category: 'Operaciones'
          }
        ],
        solutions: {
          shortTerm: [
            {
              title: 'Automatización básica de procesos',
              cost: '$15,000',
              roi: '25%',
              duration: '1-3 meses'
            }
          ],
          mediumTerm: [
            {
              title: 'Integración de sistemas ERP/CRM',
              cost: '$45,000',
              roi: '60%',
              duration: '3-12 meses'
            }
          ],
          longTerm: [
            {
              title: 'Transformación digital completa',
              cost: '$120,000',
              roi: '180%',
              duration: '1-2 años'
            }
          ]
        },
        analytics: {
          averageROI: 180,
          timeSaved: 95,
          efficiency: { current: 45, projected: 85, improvement: 89 }
        },
        recommendations: [
          { title: 'Priorizar automatización de procesos manuales', category: 'Operativa' },
          { title: 'Implementar dashboard de métricas en tiempo real', category: 'Estratégica' },
          { title: 'Integrar sistemas existentes con API unificada', category: 'Tecnológica' }
        ]
      }
    }
  }

  async generateChatResponse(message: string, context: any) {
    try {
      // Extraer solo los datos relevantes para no sobrecargar el prompt
      const relevantContext = {
        solutions: context.solutions,
        painPoints: context.painPoints,
        analytics: context.analytics,
        recommendations: context.recommendations,
      };

      const prompt = `
        Eres un asistente de IA experto en analizar datos de consultoría. Tu tarea es responder a las preguntas del usuario basándote ESTRICTAMENTE en los datos del assessment proporcionados.

        ### DATOS DEL ASSESSMENT (en formato JSON):
        \`\`\`json
        ${JSON.stringify(relevantContext, null, 2)}
        \`\`\`

        ### PREGUNTA DEL USUARIO:
        "${message}"

        ### INSTRUCCIONES:
        1.  **Basa tu respuesta únicamente en los datos del JSON anterior.** No inventes información.
        2.  Si la pregunta requiere un cálculo (ej. "cuál es el costo total"), realízalo sumando los valores correspondientes de los datos.
        3.  Responde de manera amigable, conversacional y directa.
        4.  Si la pregunta no se puede responder con los datos proporcionados, indícalo amablemente.
        5.  Utiliza formato Markdown (negritas, listas) para mejorar la legibilidad.
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Gemini chat error:', error)
      return 'Lo siento, no pude procesar tu mensaje en este momento. Por favor, intenta de nuevo.'
    }
  }

  async generateInsights(assessmentData: any) {
    try {
      const prompt = `
        Genera insights predictivos basados en el assessment:

        Datos: ${JSON.stringify(assessmentData)}

        Proporciona:
        1. Tendencias identificadas en la industria
        2. Oportunidades de mejora específicas
        3. Predicciones de ROI por implementación
        4. Benchmarking con empresas similares
        5. Recomendaciones de tecnologías emergentes

        Formato: JSON estructurado con métricas y proyecciones.
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Gemini insights error:', error)
      throw new Error('Error generating insights')
    }
  }
}

export const geminiService = new GeminiService()
