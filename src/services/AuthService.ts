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
      baseURL: `${process.env.NEXT_PUBLIC_PDZ_API_URL}/pdz-api`,
    });

    this.initializeToken();
  }

  private initializeToken() {
    if (typeof window !== 'undefined') {
      const token = this.getToken();
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
      const loginData: LoginResponse = response.data;

      if (loginData.token) {
        const maxAgeSeconds = 60 * 60 * 24; // 1 dia
        if (typeof window !== 'undefined') {
          document.cookie =
            `jwt=${loginData.token}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax` +
            (window.location.protocol === 'https:' ? '; Secure' : '');
        }
        this.axios.defaults.headers.common['Authorization'] = `Bearer ${loginData.token}`;
      }

      return loginData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async isAuthenticated(jwt: string): Promise<boolean> {
    if (!jwt) return false;
    try {
      const response = await this.axios.get('/users', {
        headers: { Authorization: `Bearer ${jwt}` },
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
    if (typeof window !== 'undefined') {
      document.cookie = 'jwt=; Path=/; Max-Age=0; SameSite=Lax';
    }
    delete this.axios.defaults.headers.common['Authorization'];
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const match = document.cookie.match(/(?:^|; )jwt=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  loginWithCallback(callbackUrl: string) {
    const encodedCallback = encodeURIComponent(callbackUrl);
    window.location.href = `${process.env.NEXT_PUBLIC_PDZ_API_URL}/pdz-api/auth/signin/discord?callback=${callbackUrl}`;
  }
}

export const authService = new AuthService();
