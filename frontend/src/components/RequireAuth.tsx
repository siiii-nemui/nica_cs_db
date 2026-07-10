import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function RequireAuth({ children }: { children: ReactNode }) {
  const { userId, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!userId) {
    const next = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <>{children}</>;
}

export default RequireAuth;
