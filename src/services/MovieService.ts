import axios from 'axios';
import { authService } from './AuthService';

export interface SearchResponse {
  Results: Array<Movie>;
}

export interface Movie {
  Title: string;
  Providers?: string[];
  Description?: string;
  Link: string;
  Size: number;
  Seeders: number;
  Peers: number;
  Tracker: string;
  TrackerId: string;
  PublishDate: string;
  Category: string[];
  CategoryDesc: string;
  Details?: string;
  MagnetUri?: string;
}

export class MovieApi {
  private axios;
  private authService = authService;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.NEXT_PUBLIC_PDZ_API_URL,
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  async search(query: string, limit: number = 10): Promise<SearchResponse> {
    try {
      const response = await this.axios.get(`/pdz-api/movies/search`, {
        params: {
          query: query,
          limit: limit,
        },
      });
      const data = response.data;

      return data as SearchResponse;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }
}
