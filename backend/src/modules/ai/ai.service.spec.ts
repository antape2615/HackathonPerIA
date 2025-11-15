import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class AIService {
    private readonly logger = new Logger(AIService.name);
    private groq: Groq;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get('GROQ_API_KEY');
        if (!apiKey) {
            this.logger.warn('GROQ_API_KEY not found, using mock mode');
        } else {
            this.groq = new Groq({
                apiKey: apiKey,
            });
            this.logger.log('Groq AI service initialized');
        }
    }

    async evaluateCode(
        code: string,
        language: string,
        question: string,
        testCasesPassed: number,
        totalTestCases: number,
    ) {
        // Si no hay API key, usar mock para desarrollo
        if (!this.groq) {
            return this.getMockEvaluation(code, language, testCasesPassed, totalTestCases);
        }

        try {
            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Eres un evaluador técnico experto. Analiza código ${language} y proporciona feedback constructivo en formato JSON. Sé objetivo y específico. Evalúa basado en calidad de código, mejores prácticas y eficiencia.`,
                    },
                    {
                        role: 'user',
                        content: `
Evalúa el siguiente código:

**Lenguaje:** ${language}
**Pregunta:** ${question}

**Código enviado:**
\`\`\`${language}
${code}
\`\`\`

**Resultados de tests:** ${testCasesPassed}/${totalTestCases} casos pasados

Proporciona tu análisis en este formato JSON exacto:
{
  "codeQuality": <número 0-100>,
  "bestPractices": <número 0-100>,
  "efficiency": <número 0-100>,
  "feedback": "<análisis general en 2-3 oraciones>",
  "strengths": ["<fortaleza específica>", "<otra fortaleza>"],
  "weaknesses": ["<debilidad específica>", "<otra debilidad>"],
  "recommendations": ["<recomendación específica>", "<otra recomendación>"]
}

Criterios de evaluación:
- codeQuality: nomenclatura, estructura, legibilidad, organización
- bestPractices: manejo de errores, edge cases, validaciones, principios SOLID
- efficiency: complejidad algorítmica, uso de memoria, optimización
            `,
                    },
                ],
                model: 'llama-3.1-70b-versatile',
                temperature: 0.3,
                max_tokens: 1500,
                response_format: { type: 'json_object' },
            });

            const result = JSON.parse(completion.choices[0].message.content);

            // Validación y saneamiento del resultado
            return {
                codeQuality: this.validateScore(result.codeQuality),
                bestPractices: this.validateScore(result.bestPractices),
                efficiency: this.validateScore(result.efficiency),
                feedback: result.feedback || 'No se pudo generar feedback específico.',
                strengths: Array.isArray(result.strengths) ? result.strengths : [],
                weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
                recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
                aiModel: 'llama-3.1-70b-versatile',
            };
        } catch (error) {
            this.logger.error('Error evaluating code with Groq:', error);
            // Fallback a mock en caso de error
            return this.getMockEvaluation(code, language, testCasesPassed, totalTestCases);
        }
    }

    private validateScore(score: any): number {
        const num = parseInt(score);
        return isNaN(num) ? 70 : Math.min(100, Math.max(0, num));
    }

    private getMockEvaluation(
        code: string,
        language: string,
        testCasesPassed: number,
        totalTestCases: number
    ) {
        const testScore = (testCasesPassed / totalTestCases) * 100;
        const baseScore = Math.max(60, testScore - 10);

        return {
            codeQuality: baseScore + Math.random() * 20,
            bestPractices: baseScore + Math.random() * 15,
            efficiency: baseScore + Math.random() * 25,
            feedback: `Código ${language} evaluado. Pasó ${testCasesPassed}/${totalTestCases} tests. En modo de desarrollo - para evaluación real configure GROQ_API_KEY.`,
            strengths: [
                'Estructura básica correcta',
                'Sintaxis adecuada del lenguaje',
                'Lógica funcional en casos básicos'
            ],
            weaknesses: [
                'Falta optimización avanzada',
                'Manejo de errores limitado',
                'Puede mejorar en casos edge'
            ],
            recommendations: [
                'Implementar manejo completo de errores',
                'Considerar optimizaciones de rendimiento',
                'Agregar validaciones adicionales',
                'Configurar GROQ_API_KEY para evaluación con IA real'
            ],
            aiModel: 'mock-mode',
            isMock: true
        };
    }

    async generateFeedback(
        code: string,
        language: string,
        questionDescription: string,
        testResults: {
            passed: number;
            total: number;
            details?: any[];
        }
    ) {
        return this.evaluateCode(
            code,
            language,
            questionDescription,
            testResults.passed,
            testResults.total
        );
    }
}