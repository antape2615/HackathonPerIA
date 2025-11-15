import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class AIService {
    private groq: any;

    constructor(private configService: ConfigService) {
        this.groq = new Groq({
            apiKey: this.configService.get('GROQ_API_KEY'),
        });
    }

    async evaluateCode(
        code: string,
        language: string,
        question: string,
        testCasesPassed: number,
        totalTestCases: number,
    ) {
        try {
            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Eres un evaluador técnico experto. Analiza código ${language} y proporciona feedback constructivo en formato JSON. Sé objetivo y específico.`,
                    },
                    {
                        role: 'user',
                        content: `
Evalúa el siguiente código:

**Pregunta:** ${question}

**Código enviado:**
\`\`\`${language}
${code}
\`\`\`

**Resultados de tests:** ${testCasesPassed}/${totalTestCases} casos pasados

Proporciona tu análisis en este formato JSON exacto:
{
  "codeQuality": ,
  "bestPractices": ,
  "efficiency": ,
  "feedback": "",
  "strengths": ["", ""],
  "weaknesses": ["", ""],
  "recommendations": ["", ""]
}

Criterios de evaluación:
- codeQuality: nomenclatura, estructura, legibilidad
- bestPractices: manejo de errores, edge cases, validaciones
- efficiency: complejidad algorítmica, uso de memoria
            `,
                    },
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.3,
                response_format: { type: 'json_object' },
            });

            const result = JSON.parse(completion.choices[0].message.content);

            return {
                codeQuality: Math.min(100, Math.max(0, result.codeQuality || 0)),
                bestPractices: Math.min(100, Math.max(0, result.bestPractices || 0)),
                efficiency: Math.min(100, Math.max(0, result.efficiency || 0)),
                feedback: result.feedback || 'No se pudo generar feedback',
                strengths: result.strengths || [],
                weaknesses: result.weaknesses || [],
                recommendations: result.recommendations || [],
            };
        } catch (error) {
            console.error('Error evaluating code with Groq:', error);
            throw new Error('Failed to evaluate code with AI');
        }
    }

    async generateTestQuestion(topic: string, difficulty: string, language: string) {
        throw new Error('Not implemented yet');
    }
}
