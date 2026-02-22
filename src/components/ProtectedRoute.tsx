import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div className="p-8 text-brand-600">Loading Infrastructure...</div>;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
