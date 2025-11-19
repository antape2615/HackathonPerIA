import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { token, user } = useAuthStore();

  const isAuthenticated = !!token && !!user;
  const normalizedRole = user?.role?.toLowerCase();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && normalizedRole && !allowedRoles.includes(normalizedRole)) {
    return (
      <Navigate
        to={normalizedRole === 'admin' ? '/admin/dashboard' : '/candidate/tests'}
        replace
      />
    );
  }

  return <>{children}</>;
}
