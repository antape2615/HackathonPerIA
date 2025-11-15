import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Trophy, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import MainLayout from '@/shared/components/layout/MainLayout';
import Card from '@/shared/components/ui/Card/Card';
import { SidebarItem } from '@/shared/components/layout/Sidebar';
import { ROUTES } from '@/shared/utils/constants';
import { testService } from '../services/test.service';

const sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', href: ROUTES.CANDIDATE_DASHBOARD, icon: LayoutDashboard },
    { label: 'Available Tests', href: ROUTES.AVAILABLE_TESTS, icon: FileText },
    { label: 'My Results', href: ROUTES.MY_RESULTS, icon: Trophy },
];

export default function TestResultDetailsPage() {
    const { id: sessionId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (sessionId) {
            loadResults();
        }
    }, [sessionId]);

    const loadResults = async () => {
        try {
            setLoading(true);
            const data = await testService.getSessionResults(sessionId!);
            console.log('Detailed results:', data);
            setResults(data);
        } catch (err) {
            console.error('Error loading results:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <MainLayout sidebarItems={sidebarItems}>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </MainLayout>
        );
    }

    if (!results || !results.evaluation) {
        return (
            <MainLayout sidebarItems={sidebarItems}>
                <Card>
                    <Card.Body>
                        <p className="text-gray-600">No results available.</p>
                        <button
                            onClick={() => navigate(ROUTES.MY_RESULTS)}
                            className="mt-4 text-blue-600 hover:text-blue-700"
                        >
                            ← Back to My Results
                        </button>
                    </Card.Body>
                </Card>
            </MainLayout>
        );
    }

    const evaluation = results.evaluation;
    const detailedAnalysis = evaluation.detailedAnalysis || [];

    return (
        <MainLayout sidebarItems={sidebarItems}>
            <div className="space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate(ROUTES.MY_RESULTS)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to My Results
                </button>

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{results.test.title}</h1>
                    <p className="text-gray-600 mt-2">{results.test.description}</p>
                </div>

                {/* Overall Score Card */}
                <Card>
                    <Card.Header>
                        <Card.Title>Overall Performance</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="grid grid-cols-5 gap-6 text-center">
                            <div>
                                <div className="text-sm text-gray-500 mb-2">Final Score</div>
                                <div className={`text-4xl font-bold ${
                                    evaluation.score >= 80 ? 'text-green-600' :
                                        evaluation.score >= 60 ? 'text-yellow-600' :
                                            'text-red-600'
                                }`}>
                                    {Math.round(evaluation.score)}%
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 mb-2">Code Quality</div>
                                <div className="text-3xl font-bold text-blue-600">
                                    {Math.round(evaluation.codeQualityScore)}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 mb-2">Best Practices</div>
                                <div className="text-3xl font-bold text-purple-600">
                                    {Math.round(evaluation.bestPracticesScore)}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 mb-2">Efficiency</div>
                                <div className="text-3xl font-bold text-green-600">
                                    {Math.round(evaluation.efficiencyScore)}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 mb-2">Test Cases</div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {evaluation.passedTestCases}/{evaluation.totalTestCases}
                                </div>
                            </div>
                        </div>

                        {/* AI Feedback */}
                        <div className="mt-6 pt-6 border-t">
                            <h3 className="font-semibold text-gray-900 mb-3">AI Feedback</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700 whitespace-pre-line">{evaluation.aiFeedback}</p>
                            </div>
                        </div>

                        {/* Overall Strengths */}
                        {evaluation.strengths && evaluation.strengths.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    Overall Strengths
                                </h3>
                                <ul className="list-disc list-inside space-y-2">
                                    {evaluation.strengths.map((strength: string, idx: number) => (
                                        <li key={idx} className="text-gray-700">{strength}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Overall Weaknesses */}
                        {evaluation.weaknesses && evaluation.weaknesses.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    Areas to Improve
                                </h3>
                                <ul className="list-disc list-inside space-y-2">
                                    {evaluation.weaknesses.map((weakness: string, idx: number) => (
                                        <li key={idx} className="text-gray-700">{weakness}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Overall Recommendations */}
                        {evaluation.recommendations && evaluation.recommendations.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    {evaluation.recommendations.map((rec: string, idx: number) => (
                                        <li key={idx} className="text-gray-700">{rec}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* Detailed Analysis per Question */}
                {detailedAnalysis.map((result: any, index: number) => (
                    <Card key={result.questionId}>
                        <Card.Header>
                            <div className="flex justify-between items-start">
                                <div>
                                    <Card.Title>Question {index + 1}: {result.questionTitle}</Card.Title>
                                    <Card.Description>
                                        {result.testCasesPassed}/{result.totalTestCases} test cases passed
                                    </Card.Description>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {result.score}/{result.questionPoints} pts
                                    </div>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {result.aiEvaluation ? (
                                <div className="space-y-4">
                                    {/* Metrics */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-blue-50 rounded">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {result.aiEvaluation.codeQuality}
                                            </div>
                                            <div className="text-sm text-gray-600">Code Quality</div>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 rounded">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {result.aiEvaluation.bestPractices}
                                            </div>
                                            <div className="text-sm text-gray-600">Best Practices</div>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded">
                                            <div className="text-2xl font-bold text-green-600">
                                                {result.aiEvaluation.efficiency}
                                            </div>
                                            <div className="text-sm text-gray-600">Efficiency</div>
                                        </div>
                                    </div>

                                    {/* AI Feedback */}
                                    <div className="bg-gray-50 p-4 rounded">
                                        <h4 className="font-semibold mb-2">AI Feedback:</h4>
                                        <p className="text-gray-700">{result.aiEvaluation.feedback}</p>
                                    </div>

                                    {/* Strengths */}
                                    {result.aiEvaluation.strengths.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                Strengths:
                                            </h4>
                                            <ul className="list-disc list-inside space-y-1">
                                                {result.aiEvaluation.strengths.map((s: string, i: number) => (
                                                    <li key={i} className="text-gray-700">{s}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Weaknesses */}
                                    {result.aiEvaluation.weaknesses.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                <XCircle className="h-5 w-5 text-red-600" />
                                                Areas to Improve:
                                            </h4>
                                            <ul className="list-disc list-inside space-y-1">
                                                {result.aiEvaluation.weaknesses.map((w: string, i: number) => (
                                                    <li key={i} className="text-gray-700">{w}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Recommendations */}
                                    {result.aiEvaluation.recommendations.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Recommendations:</h4>
                                            <ul className="list-disc list-inside space-y-1">
                                                {result.aiEvaluation.recommendations.map((r: string, i: number) => (
                                                    <li key={i} className="text-gray-700">{r}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Your Code */}
                                    <div>
                                        <h4 className="font-semibold mb-2">Your Code:</h4>
                                        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
                      <code>{result.code}</code>
                    </pre>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-600">
                                    <p>No AI evaluation available for this question.</p>
                                    <p className="mt-2">Score: {result.score}/{result.questionPoints} points</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                ))}

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate(ROUTES.MY_RESULTS)}
                        className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Back to My Results
                    </button>
                    <button
                        onClick={() => navigate(ROUTES.AVAILABLE_TESTS)}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Take Another Test
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}