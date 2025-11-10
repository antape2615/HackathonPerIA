import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env["API-KEY_GROQ_API_KEY"],
})

const ANALYSIS_PROMPT = `Eres un consultor estratégico experto. Analiza la siguiente información de assessment empresarial y genera un análisis completo con propuestas estratégicas.

Información del cliente:
{ASSESSMENT_DATA}

Genera un análisis estructurado en formato JSON con la siguiente estructura:
{
  "painPointSummary": "Resumen claro y conciso del dolor crítico identificado (2-3 oraciones)",
  "impact": {
    "business": número del 0-100 (impacto en el negocio),
    "urgency": número del 0-100 (urgencia de resolver),
    "roi": número del 0-100 (retorno de inversión potencial)
  },
  "solutions": {
    "shortTerm": [
      "Solución específica 1 para 0-3 meses",
      "Solución específica 2 para 0-3 meses",
      "Solución específica 3 para 0-3 meses"
    ],
    "mediumTerm": [
      "Solución específica 1 para 3-12 meses",
      "Solución específica 2 para 3-12 meses",
      "Solución específica 3 para 3-12 meses"
    ],
    "longTerm": [
      "Solución específica 1 para +12 meses",
      "Solución específica 2 para +12 meses",
      "Solución específica 3 para +12 meses"
    ]
  },
  "recommendations": [
    "Recomendación clave 1",
    "Recomendación clave 2",
    "Recomendación clave 3",
    "Recomendación clave 4"
  ]
}

IMPORTANTE:
- Las soluciones deben ser específicas, accionables y realistas
- Considera el presupuesto y timeline mencionados
- Las soluciones de corto plazo deben ser quick wins
- Las de mediano plazo deben transformar procesos
- Las de largo plazo deben posicionar como líder del mercado
- Responde SOLO con el JSON, sin texto adicional`

export async function POST(request: NextRequest) {
  try {
    const { assessmentData } = await request.json()

    const dataString = Object.entries(assessmentData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")

    const prompt = ANALYSIS_PROMPT.replace("{ASSESSMENT_DATA}", dataString)

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Eres un consultor estratégico experto que genera análisis en formato JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    })

    const analysisText = completion.choices[0]?.message?.content || "{}"
    const analysis = JSON.parse(analysisText)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("[v0] Error in analyze API:", error)
    return NextResponse.json({ error: "Error analyzing assessment" }, { status: 500 })
  }
}
