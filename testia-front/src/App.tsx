import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { InvitePage } from './pages/InvitePage';
import { CandidateTestsPage } from './pages/CandidateTestsPage';
import { CandidateTestPage } from './pages/CandidateTestPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminTestsPage } from './pages/AdminTestsPage';
import { AdminTestCreationWizardPage } from './pages/AdminTestCreationWizardPage';
import { AdminTestIDEPage } from './pages/AdminTestIDEPage';
import { RouteGuard } from './components/RouteGuard';
import { Toaster } from '@/components/ui/toaster';
import { AdminSubmissionDetailPage } from './pages/AdminSubmissionDetailPage';
import { useRef } from 'react';
import { useAuthStore } from "./stores/authStore";

function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const ready = useRef(false);

  // Ejecutar hydrate ANTES del primer render
  if (!ready.current) {
    hydrate();
    ready.current = true;
  }

  return (
    <Router>
      <Routes>

        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/invite" element={<InvitePage />} />

        {/* CANDIDATE ROUTES */}
        <Route
          path="/candidate/tests"
          element={
            <RouteGuard allowedRoles={['candidate']}>
              <CandidateTestsPage />
            </RouteGuard>
          }
        />


        <Route
          path="/candidate/test/:testId"
          element={
            <RouteGuard allowedRoles={['candidate']}>
              <CandidateTestPage />
            </RouteGuard>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <RouteGuard allowedRoles={['admin']}>
              <AdminDashboardPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/tests"
          element={
            <RouteGuard allowedRoles={['admin']}>
              <AdminTestsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/tests/wizard"
          element={
            <RouteGuard allowedRoles={['admin']}>
              <AdminTestCreationWizardPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/tests/:testId"
          element={
            <RouteGuard allowedRoles={['admin']}>
              <AdminTestIDEPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/submission/:id"
          element={
            <RouteGuard allowedRoles={['admin']}>
              <AdminSubmissionDetailPage />
            </RouteGuard>
          }
        />



        {/* REDIRECTS */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>

      {/* GLOBAL UI ELEMENTS */}
      <Toaster />
    </Router>
  );
}

export default App;
