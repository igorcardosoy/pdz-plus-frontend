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
      baseURL: process.env.NEXT_PUBLIC_PDZ_API_URL,
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

      if (response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      return null;
    }
  }

  async getProfilePictureUrl(): Promise<string | null> {
    try {
      const blob = await this.getProfilePicture();
      if (blob) {
        return URL.createObjectURL(blob);
      }
      return null;
    } catch (error) {
      console.error('Error creating profile picture URL:', error);
      return null;
    }
  }
}

export const userService = new UserService();
export type { UserProfile };
