import axios, { Axios } from 'axios';

interface LoginResponse {
  token: string;
  id: number;
  discordId: string | null;
  username: string;
  roles: string[];
}

class AuthService {
  user: any;
  axios: Axios;

  constructor() {
    this.user = null;
    this.axios = axios.create({
      baseURL: process.env.NEXT_PUBLIC_PDZ_API_URL + '/pdz-api',
    });

    this.initializeToken();
  }

  private initializeToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt');
      if (token) {
        this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    if (!username || !password) {
      throw new Error('Username and password are required for login.');
    }

    try {
      const response = await this.axios.post('/auth/signin', { username, password });
      const loginData = response.data;

      if (loginData.token) {
        localStorage.setItem('jwt', loginData.token);

        this.axios.defaults.headers.common['Authorization'] = `Bearer ${loginData.token}`;
      }

      return loginData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async isAuthenticated(jwt: string): Promise<boolean> {
    if (!jwt) {
      return false;
    }

    try {
      const response = await this.axios.get('/users', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      this.user = response.data;
      return true;
    } catch (error) {
      console.error('User validation failed:', error);
      return false;
    }
  }

  logout() {
    this.user = null;
    localStorage.removeItem('jwt');
    delete this.axios.defaults.headers.common['Authorization'];
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}

export const authService = new AuthService();
