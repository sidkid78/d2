import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

// Layouts
import { AgentLayout } from './layouts/AgentLayout';

// Pages
import { LoginPage } from './pages/LoginPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { InviteDetail } from './components/invites/InviteDetail.tsx';
import { SignPage } from './pages/SignPage.tsx';
import { VerifyPage } from './pages/VerifyPage.tsx';
import { InvitesPage } from './pages/InvitesPage.tsx';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign/:token" element={<SignPage />} />
            <Route path="/verify/:certificateId" element={<VerifyPage />} />

            {/* Protected Agent Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AgentLayout />}>
                <Route path="/app" element={<DashboardPage />} />
                <Route path="/app/invites" element={<InvitesPage />} />
                <Route path="/app/invites/:inviteId" element={<InviteDetail />} />
              </Route>
            </Route>

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/app" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
