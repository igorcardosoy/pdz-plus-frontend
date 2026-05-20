import { useEffect, useState } from 'react';

export type LogtoClaims = {
  sub?: string;
  name?: string;
  username?: string;
  email?: string;
  picture?: string;
  roles?: string[];
  [key: string]: unknown;
};

export function useUser() {
  const [user, setUser] = useState<LogtoClaims | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        throw new Error('Not authenticated');
      }

      const claims = (await response.json()) as LogtoClaims;
      setUser(claims);
      setProfilePictureUrl(typeof claims.picture === 'string' ? claims.picture : null);
    } catch (err) {
      setError('Erro ao carregar dados do usuário');
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return {
    user,
    profilePictureUrl,
    loading,
    error,
    loadUserData,
  };
}
