import { apiGet } from './api-client';

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
  async search(query: string, limit: number = 10): Promise<SearchResponse> {
    try {
      // Requisição via proxy autenticado Next.js
      const path = `/movies/search?query=${encodeURIComponent(query)}&limit=${limit}`;
      const data = await apiGet<SearchResponse>(path);
      return data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }
}

export const movieService = new MovieApi();
