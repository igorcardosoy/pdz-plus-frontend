import axios from 'axios';
import { authService } from './AuthService';
import { Movie } from './MovieService';

export interface MovieHistoryDTO {
  id: number;
  movie: Movie;
  downloadedAt: string;
}

export class HistoryApi {
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

  async getHistory(): Promise<MovieHistoryDTO[]> {
    try {
      const response = await this.axios.get(`/pdz-api/history`);
      return response.data as MovieHistoryDTO[];
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  }

  async addToHistory(movie: Movie): Promise<MovieHistoryDTO> {
    try {
      const response = await this.axios.post(`/pdz-api/history`, movie);
      return response.data as MovieHistoryDTO;
    } catch (error) {
      console.error('Error adding to history:', error);
      throw error;
    }
  }

  async deleteFromHistory(id: number): Promise<void> {
    try {
      await this.axios.delete(`/pdz-api/history/${id}`);
    } catch (error) {
      console.error('Error deleting from history:', error);
      throw error;
    }
  }
}

export const historyService = new HistoryApi();
