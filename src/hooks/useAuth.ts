'use client';

import { authService } from '@/services/AuthService';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getToken();

        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const isValid = await authService.isAuthenticated(token);
        setIsAuthenticated(isValid);

        if (!isValid) {
          authService.logout();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await authService.login(username, password);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    router.push('/login');
  };

  const requireAuth = () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
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
