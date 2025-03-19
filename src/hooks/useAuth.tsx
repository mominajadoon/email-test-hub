
import { useAuth as useAuthContext } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function useRequireAuth(redirectTo = '/login') {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      navigate(redirectTo, {
        state: { from: location.pathname }
      });
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate, redirectTo, location.pathname]);

  return auth;
}

export function useRedirectAuthenticated(redirectTo = '/dashboard') {
  const auth = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      navigate(redirectTo);
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate, redirectTo]);

  return auth;
}
