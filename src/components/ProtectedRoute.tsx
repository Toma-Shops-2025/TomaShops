
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: ReactNode;
  requireAuth?: boolean;
  requireSeller?: boolean;
  redirectTo?: string;
};

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireSeller = false,
  redirectTo = '/auth/login',
}: ProtectedRouteProps) => {
  const { user, loading, userType } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-t-transparent border-toma-purple rounded-full"></div>
      </div>
    );
  }
  
  // Check if user is authenticated when required
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Check if user is a seller when required
  if (requireSeller && userType !== 'seller') {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // All conditions passed, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
