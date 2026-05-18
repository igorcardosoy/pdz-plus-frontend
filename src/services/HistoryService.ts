import { apiGet, apiPost, apiDelete } from './api-client';
import { Movie } from './MovieService';

export interface MovieHistoryDTO {
  id: number;
  movie: Movie;
  downloadedAt: string;
}

export class HistoryApi {
  async getHistory(): Promise<MovieHistoryDTO[]> {
    try {
      // Requisição via proxy autenticado Next.js
      return await apiGet<MovieHistoryDTO[]>('/pdz-api/history');
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  }

  async addToHistory(movie: Movie): Promise<MovieHistoryDTO> {
    try {
      // Requisição POST via proxy autenticado Next.js
      return await apiPost<MovieHistoryDTO>('/pdz-api/history', movie);
    } catch (error) {
      console.error('Error adding to history:', error);
      throw error;
    }
  }

  async deleteFromHistory(id: number): Promise<void> {
    try {
      // Requisição DELETE via proxy autenticado Next.js
      await apiDelete<void>(`/pdz-api/history/${id}`);
    } catch (error) {
      console.error('Error deleting from history:', error);
      throw error;
    }
  }
}

export const historyService = new HistoryApi();
