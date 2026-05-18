'use client';

import { useEffect, useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    window.location.href = '/api/auth/signin';
  };

  const logout = () => {
    window.location.href = '/api/auth/logout';
  };

  const requireAuth = () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      window.location.href = '/api/auth/signin';
    }
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    requireAuth,
  };
}
