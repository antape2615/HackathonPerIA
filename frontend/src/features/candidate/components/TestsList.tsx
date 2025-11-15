import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { testService } from '../services/test.service';
import { Test } from '../types/test.types';

export const TestsList = () => {
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔄 Loading tests...');

            const data = await testService.getAvailableTests();
            console.log('✅ Tests loaded:', data);

            setTests(data);
        } catch (err: any) {
            console.error('❌ Error loading tests:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load tests');
        } finally {
            setLoading(false);
        }
    };

    const handleStartTest = async (testId: string) => {
        try {
            console.log('🚀 Starting test:', testId);
            const session = await testService.startTest(testId);
            console.log('✅ Test session created:', session);

            // Navegar usando la ruta de tu constants
            navigate(`/candidate/tests/${session.id}/take`);
        } catch (err: any) {
            console.error('❌ Error starting test:', err);
            const errorMessage = err.response?.data?.message || 'Failed to start test';
            alert(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-4 text-lg text-gray-600">Loading tests...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error loading tests</h3>
                        <p className="mt-1 text-sm text-red-600">{error}</p>
                        <button
                            onClick={loadTests}
                            className="mt-3 text-sm font-medium text-red-600 hover:text-red-500 underline"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (tests.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No tests available</h3>
                <p className="mt-1 text-sm text-gray-500">Check back later for new tests!</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => (
                <div
                    key={test.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
                >
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900 flex-1">{test.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                            test.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                                test.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                        }`}>
              {test.difficulty}
            </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{test.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium">
              💻 {test.language}
            </span>
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded font-medium">
              🔧 {test.framework}
            </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b">
                        <span>⏱️ {test.duration} min</span>
                        <span>📝 {test._count.questions} questions</span>
                    </div>

                    <button
                        onClick={() => handleStartTest(test.id)}
                        className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Start Test
                    </button>
                </div>
            ))}
        </div>
    );
};