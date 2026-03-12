import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import StudentsPage from '../pages/StudentsPage';
import AttendancePage from '../pages/AttendancePage';
import PaymentsPage from '../pages/PaymentsPage';
import ExamsPage from '../pages/ExamsPage';
import OnlineExamsPage from '../pages/OnlineExamsPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';

function PrivateRoute({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  const { user } = useApp();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/online-exams" element={<OnlineExamsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}