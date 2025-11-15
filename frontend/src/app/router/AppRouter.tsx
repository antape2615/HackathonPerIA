import {Routes, Route, Navigate} from 'react-router-dom';
import {useAuthStore} from '@/features/auth/store/authStore';
import {ROUTES} from '@/shared/utils/constants';
import ProtectedRoute from './ProtectedRoute';

// Auth pages
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';

// Evaluator pages
import EvaluatorDashboard from '@/features/evaluator/pages/EvaluatorDashboard';
import CreateTestPage from '@/features/evaluator/pages/CreateTestPage';
import TestListPage from '@/features/evaluator/pages/TestListPage';

// Candidate pages
import CandidateDashboard from '@/features/candidate/pages/CandidateDashboard';
import AvailableTestsPage from '@/features/candidate/pages/AvailableTestsPage';
import TakeTestPage from '@/features/candidate/pages/TakeTestPage';
import MyResultsPage from '@/features/candidate/pages/MyResultsPage';

// Analytics
import AnalyticsDashboard from '@/features/dashboard/pages/AnalyticsDashboard';
import TestResultDetailsPage from '@/features/candidate/pages/TestResultDetailsPage';

export function AppRouter() {
    const {isAuthenticated, user} = useAuthStore();

    return (
        <Routes>
            {/* Public routes */}
            <Route
                path={ROUTES.LOGIN}
                element={
                    isAuthenticated ? (
                        <Navigate
                            to={user?.role === 'EVALUATOR' ? ROUTES.EVALUATOR_DASHBOARD : ROUTES.CANDIDATE_DASHBOARD}
                            replace/>
                    ) : (
                        <LoginPage/>
                    )
                }
            />
            <Route
                path={ROUTES.REGISTER}
                element={
                    isAuthenticated ? (
                        <Navigate
                            to={user?.role === 'EVALUATOR' ? ROUTES.EVALUATOR_DASHBOARD : ROUTES.CANDIDATE_DASHBOARD}
                            replace/>
                    ) : (
                        <RegisterPage/>
                    )
                }
            />

            {/* Evaluator routes */}
            <Route
                path={ROUTES.EVALUATOR_DASHBOARD}
                element={
                    <ProtectedRoute allowedRoles={['EVALUATOR', 'ADMIN']}>
                        <EvaluatorDashboard/>
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.CREATE_TEST}
                element={
                    <ProtectedRoute allowedRoles={['EVALUATOR', 'ADMIN']}>
                        <CreateTestPage/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/candidate/results/:id"
                element={
                    <ProtectedRoute allowedRoles={['CANDIDATE', 'ADMIN']}>
                        <TestResultDetailsPage/>
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.TEST_LIST}
                element={
                    <ProtectedRoute allowedRoles={['EVALUATOR', 'ADMIN']}>
                        <TestListPage/>
                    </ProtectedRoute>
                }
            />

            {/* Candidate routes */}
            <Route
                path={ROUTES.CANDIDATE_DASHBOARD}
                element={
                    <ProtectedRoute allowedRoles={['CANDIDATE', 'ADMIN']}>
                        <CandidateDashboard/>
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.AVAILABLE_TESTS}
                element={
                    <ProtectedRoute allowedRoles={['CANDIDATE', 'ADMIN']}>
                        <AvailableTestsPage/>
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.TAKE_TEST}
                element={
                    <ProtectedRoute allowedRoles={['CANDIDATE', 'ADMIN']}>
                        <TakeTestPage/>
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.MY_RESULTS}
                element={
                    <ProtectedRoute allowedRoles={['CANDIDATE', 'ADMIN']}>
                        <MyResultsPage/>
                    </ProtectedRoute>
                }
            />

            {/* Analytics */}
            <Route
                path={ROUTES.ANALYTICS}
                element={
                    <ProtectedRoute allowedRoles={['EVALUATOR', 'ADMIN']}>
                        <AnalyticsDashboard/>
                    </ProtectedRoute>
                }
            />

            {/* Root redirect */}
            <Route
                path={ROUTES.HOME}
                element={
                    isAuthenticated ? (
                        <Navigate
                            to={user?.role === 'EVALUATOR' ? ROUTES.EVALUATOR_DASHBOARD : ROUTES.CANDIDATE_DASHBOARD}
                            replace/>
                    ) : (
                        <Navigate to={ROUTES.LOGIN} replace/>
                    )
                }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace/>}/>
        </Routes>
    );
}
