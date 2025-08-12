import axios, { Axios } from 'axios';

interface UserProfile {
  id: number;
  discordId: string | null;
  username: string;
  roles: string[];
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

class UserService {
  private axios: Axios;

  constructor() {
    this.axios = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_PDZ_API_URL}/pdz-api`,
    });
  }

  private getAuthHeaders() {
    if (typeof window === 'undefined') return {};

    const match = document.cookie.match(/(?:^|; )jwt=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;

    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await this.axios.get('/users', {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async getProfilePicture(): Promise<Blob | null> {
    try {
      const response = await this.axios.get('/users/profile-picture', {
        headers: this.getAuthHeaders(),
        responseType: 'blob',
      });

      if (response.data && response.data instanceof Blob && response.data.size > 0) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile picture blob:', error);
      return null;
    }
  }

  async getProfilePictureUrl(): Promise<string | null> {
    try {
      // Primeiro tenta obter como URL/string
      try {
        const response = await this.axios.get('/users/profile-picture', {
          headers: this.getAuthHeaders(),
        });

        // Se retornar uma string (URL), usa diretamente
        if (response.data && typeof response.data === 'string' && response.data.startsWith('http')) {
          return response.data;
        }
      } catch (urlError) {
        console.log('Profile picture not available as URL, trying as blob...');
      }

      // Se não conseguiu como URL, tenta como blob
      try {
        const blobResponse = await this.axios.get('/users/profile-picture', {
          headers: this.getAuthHeaders(),
          responseType: 'blob',
        });

        if (blobResponse.data && blobResponse.data instanceof Blob && blobResponse.data.size > 0) {
          return URL.createObjectURL(blobResponse.data);
        }
      } catch (blobError) {
        console.log('Profile picture not available as blob either');
      }

      return null;
    } catch (error) {
      console.error('Error getting profile picture URL:', error);
      return null;
    }
  }
}

export const userService = new UserService();
export type { UserProfile };
