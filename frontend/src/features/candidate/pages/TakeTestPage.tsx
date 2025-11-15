import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Trophy, Clock, CheckCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import MainLayout from '@/shared/components/layout/MainLayout';
import Card from '@/shared/components/ui/Card/Card';
import { SidebarItem } from '@/shared/components/layout/Sidebar';
import { ROUTES } from '@/shared/utils/constants';
import { testService } from '../services/test.service';
import { TestSession } from '../types/test.types';

const sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', href: ROUTES.CANDIDATE_DASHBOARD, icon: LayoutDashboard },
    { label: 'Available Tests', href: ROUTES.AVAILABLE_TESTS, icon: FileText },
    { label: 'My Results', href: ROUTES.MY_RESULTS, icon: Trophy },
];

export default function TakeTestPage() {
    const { id: sessionId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [session, setSession] = useState<TestSession | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [code, setCode] = useState('');
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (sessionId) {
            loadSession();
        }
    }, [sessionId]);

    // Timer countdown
    useEffect(() => {
        if (!session || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleFinishTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [session, timeLeft]);


    const loadSession = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('📡 Loading session:', sessionId);

            // Usar el nuevo endpoint
            const sessionData = await testService.getSession(sessionId!);
            console.log('✅ Session loaded:', sessionData);

            setSession(sessionData);

            // Calcular tiempo restante
            const expiresAt = new Date(sessionData.expiresAt).getTime();
            const now = Date.now();
            const secondsLeft = Math.max(0, Math.floor((expiresAt - now) / 1000));
            setTimeLeft(secondsLeft);

            // Cargar código inicial de la primera pregunta
            if (sessionData.test.questions.length > 0) {
                const firstQuestion = sessionData.test.questions[0];
                setCode(firstQuestion.starterCode);
            }

            if (sessionData.answers && sessionData.answers.length > 0) {
                const savedAnswers: Record<string, string> = {};
                sessionData.answers.forEach((answer: any) => {
                    savedAnswers[answer.questionId] = answer.code;
                });
                setAnswers(savedAnswers);

                // Si hay respuesta para la primera pregunta, cargarla
                const firstQuestionId = sessionData.test.questions[0].id;
                if (savedAnswers[firstQuestionId]) {
                    setCode(savedAnswers[firstQuestionId]);
                }
            }
        } catch (err: any) {
            console.error('❌ Error loading session:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load test session');
        } finally {
            setLoading(false);
        }
    };

    const currentQuestion = session?.test.questions[currentQuestionIndex];

    const handleQuestionChange = async (index: number) => {
        // Guardar respuesta actual antes de cambiar
        if (currentQuestion) {
            await saveAnswer();
        }

        setCurrentQuestionIndex(index);
        const newQuestion = session?.test.questions[index];
        if (newQuestion) {
            // Cargar código guardado o código inicial
            setCode(answers[newQuestion.id] || newQuestion.starterCode);
        }
    };

    const saveAnswer = async () => {
        if (!currentQuestion || !sessionId) return;

        try {
            setSaving(true);
            await testService.submitAnswer({
                sessionId,
                questionId: currentQuestion.id,
                code,
            });

            // Actualizar respuestas guardadas
            setAnswers((prev) => ({
                ...prev,
                [currentQuestion.id]: code,
            }));

            console.log('✅ Answer saved');
        } catch (err: any) {
            console.error('Error saving answer:', err);
            // No mostramos error al usuario para no interrumpir
        } finally {
            setSaving(false);
        }
    };

    const handleFinishTest = async () => {
        if (!sessionId) return;

        await saveAnswer();

        try {
            setLoading(true);
            await testService.finishTest(sessionId);

            // Redirigir a My Results en lugar de resultados individuales
            navigate(ROUTES.MY_RESULTS);
        } catch (err: any) {
            console.error('Error finishing test:', err);
            alert('Failed to submit test. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <MainLayout sidebarItems={sidebarItems}>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-4 text-lg">Loading test...</span>
                </div>
            </MainLayout>
        );
    }

    if (error || !session) {
        return (
            <MainLayout sidebarItems={sidebarItems}>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-red-800 font-semibold">Error</h3>
                    <p className="text-red-600 mt-2">{error || 'Test session not found'}</p>
                    <button
                        onClick={() => navigate(ROUTES.AVAILABLE_TESTS)}
                        className="mt-4 text-red-600 underline"
                    >
                        Go back to tests
                    </button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Header with Timer */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{session.test.title}</h1>
                            <p className="text-gray-600 mt-1">
                                Question {currentQuestionIndex + 1} of {session.test.questions.length}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                timeLeft < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                                <Clock className="h-5 w-5" />
                                <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
                            </div>
                            {saving && <span className="text-sm text-gray-500">Saving...</span>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Questions List - Left Sidebar */}
                    <div className="col-span-3">
                        <Card>
                            <Card.Header>
                                <Card.Title>Questions</Card.Title>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <div className="divide-y">
                                    {session.test.questions.map((question, index) => (
                                        <button
                                            key={question.id}
                                            onClick={() => handleQuestionChange(index)}
                                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition ${
                                                index === currentQuestionIndex ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Q{index + 1}</span>
                                                {answers[question.id] ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 truncate">{question.title}</p>
                                            <span className="text-xs text-gray-500">{question.points} pts</span>
                                        </button>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-9 space-y-6">
                        {/* Question Description */}
                        <Card>
                            <Card.Header>
                                <Card.Title>{currentQuestion?.title}</Card.Title>
                                <Card.Description>{currentQuestion?.points} points</Card.Description>
                            </Card.Header>
                            <Card.Body>
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: currentQuestion?.description || '' }}
                                />

                                {/* Test Cases (non-hidden ones) */}
                                {currentQuestion && currentQuestion.testCases.filter(tc => !tc.isHidden).length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="font-semibold mb-3">Example Test Cases:</h4>
                                        <div className="space-y-3">
                                            {currentQuestion.testCases
                                                .filter(tc => !tc.isHidden)
                                                .map((testCase) => (
                                                    <div key={testCase.id} className="bg-gray-50 rounded p-3 text-sm">
                                                        <div className="font-mono">
                                                            <span className="text-gray-600">Input:</span>{' '}
                                                            <span className="text-blue-600">{testCase.input}</span>
                                                        </div>
                                                        <div className="font-mono mt-1">
                                                            <span className="text-gray-600">Expected:</span>{' '}
                                                            <span className="text-green-600">{testCase.expectedOutput}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                        {/* Code Editor */}
                        <Card>
                            <Card.Header>
                                <div className="flex justify-between items-center">
                                    <Card.Title>Code Editor</Card.Title>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={saveAnswer}
                                            disabled={saving}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : 'Save Answer'}
                                        </button>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Editor
                                    height="500px"
                                    language={session.test.language.toLowerCase()}
                                    value={code}
                                    onChange={(value) => setCode(value || '')}
                                    theme="vs-dark"
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        lineNumbers: 'on',
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                    }}
                                />
                            </Card.Body>
                        </Card>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between">
                            <button
                                onClick={() => handleQuestionChange(currentQuestionIndex - 1)}
                                disabled={currentQuestionIndex === 0}
                                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            {currentQuestionIndex === session.test.questions.length - 1 ? (
                                <button
                                    onClick={handleFinishTest}
                                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Submit Test
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleQuestionChange(currentQuestionIndex + 1)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Next Question
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}