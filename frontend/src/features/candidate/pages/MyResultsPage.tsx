import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Trophy, ArrowRight, Calendar, Clock } from 'lucide-react';
import MainLayout from '@/shared/components/layout/MainLayout';
import Card from '@/shared/components/ui/Card/Card';
import EmptyState from '@/shared/components/feedback/EmptyState';
import { ROUTES } from '@/shared/utils/constants';
import { SidebarItem } from '@/shared/components/layout/Sidebar';
import { testService } from '../services/test.service';
import { TestSession } from '../types/test.types';

const sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', href: ROUTES.CANDIDATE_DASHBOARD, icon: LayoutDashboard },
    { label: 'Available Tests', href: ROUTES.AVAILABLE_TESTS, icon: FileText },
    { label: 'My Results', href: ROUTES.MY_RESULTS, icon: Trophy },
];

export default function MyResultsPage() {
    const [sessions, setSessions] = useState<TestSession[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        try {
            setLoading(true);
            const data = await testService.getMySessions();
            console.log('My sessions:', data);
            setSessions(data);
        } catch (err) {
            console.error('Error loading results:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
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

    if (sessions.length === 0) {
        return (
            <MainLayout sidebarItems={sidebarItems}>
                <div>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
                        <p className="text-gray-600 mt-1">View your test performance and AI feedback</p>
                    </div>

                    <EmptyState
                        icon={Trophy}
                        title="No results yet"
                        description="Complete tests to see your results and AI-powered feedback here"
                    />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout sidebarItems={sidebarItems}>
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
                    <p className="text-gray-600 mt-1">View your test performance and AI feedback</p>
                </div>

                <div className="grid gap-6">
                    {sessions.map((session: any) => (
                        <Card key={session.id}>
                            <Card.Body>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {session.test.title}
                                            </h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    session.test.difficulty === 'EASY'
                                                        ? 'bg-green-100 text-green-800'
                                                        : session.test.difficulty === 'MEDIUM'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                        {session.test.difficulty}
                      </span>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4">
                                            {session.test.description}
                                        </p>

                                        <div className="flex items-center gap-6 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(session.completedAt)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                {formatTime(session.completedAt)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                {session.test.questions.length} questions
                                            </div>
                                        </div>

                                        {session.evaluation && (
                                            <div className="mt-4 flex items-center gap-6">
                                                <div>
                                                    <span className="text-sm text-gray-500">Overall Score</span>
                                                    <div
                                                        className={`text-3xl font-bold mt-1 ${
                                                            session.evaluation.score >= 80
                                                                ? 'text-green-600'
                                                                : session.evaluation.score >= 60
                                                                    ? 'text-yellow-600'
                                                                    : 'text-red-600'
                                                        }`}
                                                    >
                                                        {Math.round(session.evaluation.score)}%
                                                    </div>
                                                </div>

                                                <div className="flex gap-4">
                                                    <div className="text-center">
                                                        <div className="text-sm text-gray-500">Code Quality</div>
                                                        <div className="text-lg font-bold text-blue-600 mt-1">
                                                            {Math.round(session.evaluation.codeQualityScore)}
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm text-gray-500">Best Practices</div>
                                                        <div className="text-lg font-bold text-purple-600 mt-1">
                                                            {Math.round(session.evaluation.bestPracticesScore)}
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm text-gray-500">Efficiency</div>
                                                        <div className="text-lg font-bold text-green-600 mt-1">
                                                            {Math.round(session.evaluation.efficiencyScore)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="ml-auto">
                                                    <span className="text-sm text-gray-500">Test Cases</span>
                                                    <div className="text-lg font-semibold text-gray-900 mt-1">
                                                        {session.evaluation.passedTestCases}/{session.evaluation.totalTestCases}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => navigate(`/candidate/results/${session.id}`)}
                                        className="ml-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        View Details
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}