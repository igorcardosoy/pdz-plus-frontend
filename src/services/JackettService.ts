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

const excludedCategories = [
  '6000',
  '6010',
  '6060',
  '100067',
  '100051',
  '100050',
  '100049',
  '100048',
  '6040',
  '6045',
  '6070',
  '100500',
  '100599',
  '100203',
];

export class JackettApi {
  private axios;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.NEXT_PUBLIC_JACKETT_API_URL,
    });
  }

  async searchInJackett(query: string, limit: number = 10): Promise<SearchResponse> {
    try {
      const response = await fetch(`/api/jackett/search?query=${encodeURIComponent(query)}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar no Jackett');
      }
      const data = await response.json();
      const filteredResults = data.Results.filter((result: Movie) => {
        if (result.Category.some((cat: string | number) => excludedCategories.includes(cat.toString()))) {
          return false;
        }
        return true;
      });
      return {
        ...data,
        Results: filteredResults,
      };
    } catch (error) {
      console.error('Error searching in Jackett:', error);
      throw error;
    }
  }
}
