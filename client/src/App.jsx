import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentPortal from './pages/StudentPortal';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintDetail from './pages/ComplaintDetail';
import Analytics from './pages/Analytics';
import TransparencyWall from './pages/TransparencyWall';
import ManageAdmins from './pages/ManageAdmins';
import BottomTabBar from './components/BottomTabBar';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'student' ? '/student' : '/admin'} replace />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/login" element={user ? <Navigate to={user.role === 'student' ? '/student' : '/admin'} replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={user.role === 'student' ? '/student' : '/admin'} replace /> : <Register />} />
        <Route path="/transparency" element={<TransparencyWall />} />

        {/* Student */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentPortal />
          </ProtectedRoute>
        } />

        {/* Admin / Super Admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <Analytics />
          </ProtectedRoute>
        } />

        <Route path="/manage-admins" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <ManageAdmins />
          </ProtectedRoute>
        } />

        {/* Shared (authenticated) */}
        <Route path="/complaint/:id" element={
          <ProtectedRoute>
            <ComplaintDetail />
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      {/* Renders bottom tab bar on mobile for logged-in users */}
      <BottomTabBar />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="relative min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden selection:bg-neonPurple/30">
            {/* ChronoVerse Ambient Background Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-neonPurple/20 blur-[120px] animate-orb-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-neonBlue/20 blur-[120px] animate-orb-pulse" style={{ animationDelay: '2s' }} />
            </div>
            
            {/* Foreground Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <AppRoutes />
            </div>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
