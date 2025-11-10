import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env["API_KEY_GROQ_API_KEY"],
})

const SYSTEM_PROMPT = `Eres un asistente experto en diagnóstico empresarial para Periscan AI. Tu objetivo es realizar un assessment express conversacional para identificar el dolor crítico del negocio del cliente.

Debes recopilar la siguiente información de manera natural y conversacional:
1. Nombre de la empresa
2. Industria/sector
3. Dolor o problema crítico principal
4. Proceso actual relacionado con ese dolor
5. Objetivos que quieren alcanzar
6. Timeline deseado
7. Presupuesto aproximado (opcional)

IMPORTANTE:
- Haz UNA pregunta a la vez
- Sé empático y profesional
- Profundiza en las respuestas para entender el contexto real
- Cuando tengas toda la información, responde con: "ASSESSMENT_COMPLETE"
- Mantén un tono consultivo y estratégico

Responde SOLO con tu siguiente pregunta o comentario. NO incluyas información adicional.`

interface Message {
  role: "system" | "assistant" | "user"
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { messages, assessmentData } = await request.json()

    const conversationMessages: Message[] = [{ role: "system", content: SYSTEM_PROMPT }, ...messages]

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 500,
    })

    const assistantMessage = completion.choices[0]?.message?.content || "Lo siento, no pude procesar tu respuesta."

    // Extract assessment data from conversation
    const updatedAssessmentData = { ...assessmentData }
    const lastUserMessage = messages[messages.length - 1]?.content.toLowerCase() || ""

    // Simple extraction logic (can be enhanced with more sophisticated NLP)
    if (!updatedAssessmentData.companyName && messages.length === 1) {
      updatedAssessmentData.companyName = messages[messages.length - 1]?.content
    } else if (!updatedAssessmentData.industry && messages.length === 3) {
      updatedAssessmentData.industry = messages[messages.length - 1]?.content
    } else if (!updatedAssessmentData.painPoint && messages.length === 5) {
      updatedAssessmentData.painPoint = messages[messages.length - 1]?.content
    } else if (!updatedAssessmentData.currentProcess && messages.length === 7) {
      updatedAssessmentData.currentProcess = messages[messages.length - 1]?.content
    } else if (!updatedAssessmentData.goals && messages.length === 9) {
      updatedAssessmentData.goals = messages[messages.length - 1]?.content
    } else if (!updatedAssessmentData.timeline && messages.length === 11) {
      updatedAssessmentData.timeline = messages[messages.length - 1]?.content
    } else if (!updatedAssessmentData.budget && messages.length === 13) {
      updatedAssessmentData.budget = messages[messages.length - 1]?.content
    }

    const isComplete = assistantMessage.includes("ASSESSMENT_COMPLETE") || messages.length >= 14

    return NextResponse.json({
      message: isComplete
        ? "¡Perfecto! He recopilado toda la información necesaria. Ahora voy a analizar tu situación y generar propuestas estratégicas personalizadas. Esto tomará solo unos segundos..."
        : assistantMessage,
      assessmentData: updatedAssessmentData,
      complete: isComplete,
    })
  } catch (error) {
    console.error("[v0] Error in chat API:", error)
    return NextResponse.json({ error: "Error processing request" }, { status: 500 })
  }
}
