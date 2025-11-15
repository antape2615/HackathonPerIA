import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { UserRole } from '@/shared/types';
import { ROUTES } from '@/shared/utils/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.role === 'EVALUATOR' ? ROUTES.EVALUATOR_DASHBOARD : ROUTES.CANDIDATE_DASHBOARD;
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
