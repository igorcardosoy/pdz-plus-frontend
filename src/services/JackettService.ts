import axios from 'axios';

export interface SearchResponse {
  Results: Array<Movie>;
}

export interface Movie {
  Title: string;
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

export class JackettApi {
  private axios;

  constructor() {
    this.axios = axios.create({
      baseURL: '/api',
    });
  }

  async searchInJackett(query: string): Promise<SearchResponse> {
    const response = await this.axios.get(`/search?query=${encodeURIComponent(query)}&limit=10`);
    return response.data as SearchResponse;
  }
}
