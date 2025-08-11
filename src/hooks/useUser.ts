import { UserProfile, userService } from '@/services/UserService';
import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userProfile = await userService.getUserProfile();
      setUser(userProfile);

      const pictureUrl = await userService.getProfilePictureUrl();
      setProfilePictureUrl(pictureUrl);
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
