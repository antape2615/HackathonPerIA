import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TestSessionStatus } from '@prisma/client';
import { AIService } from '@/modules/ai';

@Injectable()
export class EvaluationsService {
    constructor(private prisma: PrismaService, private aiService: AIService, ) {}

    async startTest(testId: string, candidateId: string) {
        const test = await this.prisma.test.findUnique({
            where: { id: testId },
        });

        if (!test) {
            throw new NotFoundException('Test not found');
        }

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + test.duration);

        return this.prisma.testSession.create({
            data: {
                testId,
                candidateId,
                expiresAt,
                status: TestSessionStatus.IN_PROGRESS,
            },
            include: {
                test: {
                    include: {
                        questions: {
                            include: {
                                testCases: {
                                    where: {
                                        isHidden: false,
                                    },
                                },
                            },
                            orderBy: {
                                order: 'asc',
                            },
                        },
                    },
                },
            },
        });
    }

    // NUEVO: Obtener sesión activa
    async getSession(sessionId: string, candidateId: string) {
        const session = await this.prisma.testSession.findUnique({
            where: { id: sessionId },
            include: {
                test: {
                    include: {
                        questions: {
                            include: {
                                testCases: {
                                    where: {
                                        isHidden: false,
                                    },
                                },
                            },
                            orderBy: {
                                order: 'asc',
                            },
                        },
                    },
                },
                answers: true,
            },
        });

        if (!session) {
            throw new NotFoundException('Test session not found');
        }

        // Verificar que la sesión pertenece al candidato
        if (session.candidateId !== candidateId) {
            throw new BadRequestException('Unauthorized access to this session');
        }

        return session;
    }

    async submitAnswer(sessionId: string, questionId: string, code: string) {
        const session = await this.prisma.testSession.findUnique({
            where: { id: sessionId },
        });

        if (!session || session.status !== TestSessionStatus.IN_PROGRESS) {
            throw new BadRequestException('Invalid or expired session');
        }

        return this.prisma.answer.upsert({
            where: {
                sessionId_questionId: {
                    sessionId,
                    questionId,
                },
            },
            create: {
                sessionId,
                questionId,
                code,
            },
            update: {
                code,
            },
        });
    }

    async finishTest(sessionId: string, candidateId: string) {
        const session = await this.prisma.testSession.findUnique({
            where: { id: sessionId },
            include: {
                test: {
                    include: {
                        questions: {
                            include: {
                                testCases: true,
                            },
                        },
                    },
                },
                answers: {
                    include: {
                        question: {
                            include: {
                                testCases: true,
                            },
                        },
                    },
                },
            },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        if (session.candidateId !== candidateId) {
            throw new BadRequestException('Unauthorized');
        }

        // Evaluar cada respuesta con IA
        const evaluationResults = await this.evaluateAnswers(session);

        // Calcular métricas agregadas
        const metrics = this.calculateMetrics(evaluationResults);

        // Extraer strengths, weaknesses, recommendations de todas las preguntas
        const allStrengths: string[] = [];
        const allWeaknesses: string[] = [];
        const allRecommendations: string[] = [];

        evaluationResults.forEach((result) => {
            if (result.aiEvaluation) {
                allStrengths.push(...result.aiEvaluation.strengths);
                allWeaknesses.push(...result.aiEvaluation.weaknesses);
                allRecommendations.push(...result.aiEvaluation.recommendations);
            }
        });

        // Crear evaluación final
        const evaluation = await this.prisma.evaluation.create({
            data: {
                sessionId,
                totalScore: metrics.totalScore,
                totalPoints: metrics.totalPoints,
                passedTestCases: metrics.passedTestCases,
                totalTestCases: metrics.totalTestCases,
                codeQualityScore: metrics.avgCodeQuality,
                bestPracticesScore: metrics.avgBestPractices,
                efficiencyScore: metrics.avgEfficiency,
                score: metrics.finalScore,
                aiFeedback: this.generateOverallFeedback(metrics),
                strengths: allStrengths,
                weaknesses: allWeaknesses,
                recommendations: allRecommendations,
                detailedAnalysis: evaluationResults,
            },
        });

        // Actualizar estado de la sesión
        await this.prisma.testSession.update({
            where: { id: sessionId },
            data: {
                status: TestSessionStatus.COMPLETED,
                completedAt: new Date(),
            },
        });

        return {
            session,
            evaluation,
            results: evaluationResults,
        };
    }

    private async evaluateAnswers(session: any) {
        const results = [];

        for (const answer of session.answers) {
            // Simular ejecución de test cases
            const testCaseResults = this.mockExecuteTestCases(
                answer.code,
                answer.question.testCases,
            );

            const testCasesPassed = testCaseResults.filter((r) => r.passed).length;
            const totalTestCases = testCaseResults.length;

            // Evaluar con IA
            try {
                const aiEvaluation = await this.aiService.evaluateCode(
                    answer.code,
                    session.test.language,
                    answer.question.title,
                    testCasesPassed,
                    totalTestCases,
                );

                results.push({
                    questionId: answer.questionId,
                    questionTitle: answer.question.title,
                    questionPoints: answer.question.points,
                    code: answer.code,
                    testCaseResults,
                    testCasesPassed,
                    totalTestCases,
                    aiEvaluation,
                    score: this.calculateQuestionScore(
                        testCasesPassed,
                        totalTestCases,
                        aiEvaluation,
                        answer.question.points,
                    ),
                });
            } catch (error) {
                console.error('Error evaluating with AI:', error);

                // Fallback sin IA
                results.push({
                    questionId: answer.questionId,
                    questionTitle: answer.question.title,
                    questionPoints: answer.question.points,
                    code: answer.code,
                    testCaseResults,
                    testCasesPassed,
                    totalTestCases,
                    aiEvaluation: null,
                    score: Math.round((testCasesPassed / totalTestCases) * answer.question.points),
                });
            }
        }

        return results;
    }

    private mockExecuteTestCases(code: string, testCases: any[]) {
        // MOCK: Simular ejecución de test cases
        return testCases.map((tc) => ({
            testCaseId: tc.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: tc.expectedOutput, // Mock: siempre pasa
            passed: true, // Mock: siempre pasa
            executionTime: Math.random() * 100,
        }));
    }

    private calculateQuestionScore(
        passed: number,
        total: number,
        aiEvaluation: any,
        maxPoints: number,
    ): number {
        // 60% por test cases
        const testCaseScore = (passed / total) * 0.6;

        // 40% por calidad del código
        let qualityScore = 0;
        if (aiEvaluation) {
            qualityScore =
                ((aiEvaluation.codeQuality +
                        aiEvaluation.bestPractices +
                        aiEvaluation.efficiency) /
                    300) *
                0.4;
        }

        return Math.round((testCaseScore + qualityScore) * maxPoints);
    }

    private calculateMetrics(results: any[]) {
        const totalScore = results.reduce((sum, r) => sum + r.score, 0);
        const totalPoints = results.reduce((sum, r) => sum + r.questionPoints, 0);
        const passedTestCases = results.reduce((sum, r) => sum + r.testCasesPassed, 0);
        const totalTestCases = results.reduce((sum, r) => sum + r.totalTestCases, 0);

        const avgCodeQuality =
            results.reduce((sum, r) => sum + (r.aiEvaluation?.codeQuality || 0), 0) /
            results.length;
        const avgBestPractices =
            results.reduce((sum, r) => sum + (r.aiEvaluation?.bestPractices || 0), 0) /
            results.length;
        const avgEfficiency =
            results.reduce((sum, r) => sum + (r.aiEvaluation?.efficiency || 0), 0) /
            results.length;

        const finalScore = Math.round((totalScore / totalPoints) * 100);

        return {
            totalScore,
            totalPoints,
            passedTestCases,
            totalTestCases,
            avgCodeQuality: Math.round(avgCodeQuality),
            avgBestPractices: Math.round(avgBestPractices),
            avgEfficiency: Math.round(avgEfficiency),
            finalScore,
        };
    }

    private generateOverallFeedback(metrics: any): string {
        let feedback = 'Evaluación completada.\n\n';

        if (metrics.avgCodeQuality > 80) {
            feedback += '✅ Excelente calidad de código.\n';
        } else if (metrics.avgCodeQuality > 60) {
            feedback += '⚠️ Buena calidad de código, pero hay espacio para mejorar.\n';
        } else {
            feedback += '❌ La calidad del código necesita mejoras significativas.\n';
        }

        if (metrics.avgBestPractices > 80) {
            feedback += '✅ Excelente aplicación de mejores prácticas.\n';
        } else if (metrics.avgBestPractices > 60) {
            feedback += '⚠️ Considera mejorar el uso de mejores prácticas.\n';
        } else {
            feedback += '❌ Es importante mejorar el manejo de errores y edge cases.\n';
        }

        if (metrics.avgEfficiency > 80) {
            feedback += '✅ Código muy eficiente.\n';
        } else if (metrics.avgEfficiency > 60) {
            feedback += '⚠️ Revisa la complejidad algorítmica para mejorar la eficiencia.\n';
        } else {
            feedback += '❌ El código tiene problemas de eficiencia que deben abordarse.\n';
        }

        feedback += `\n📊 Test cases: ${metrics.passedTestCases}/${metrics.totalTestCases} pasados`;
        feedback += `\n🎯 Puntuación final: ${metrics.finalScore}%`;

        return feedback;
    }

    async getSessionResults(sessionId: string) {
        return this.prisma.testSession.findUnique({
            where: { id: sessionId },
            include: {
                test: {
                    include: {
                        questions: true,
                    },
                },
                answers: {
                    include: {
                        question: true,
                    },
                },
                evaluation: true,
            },
        });
    }

    async getMySessions(candidateId: string) {
        return this.prisma.testSession.findMany({
            where: {
                candidateId,
                status: TestSessionStatus.COMPLETED,
            },
            include: {
                test: {
                    include: {
                        questions: true,
                    },
                },
                evaluation: true,
            },
            orderBy: {
                completedAt: 'desc',
            },
        });
    }
}