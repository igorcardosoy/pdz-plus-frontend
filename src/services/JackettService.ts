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

let excludedCategories = [
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
      baseURL: '',
    });
  }

  async searchInJackett(query: string): Promise<SearchResponse> {
    const response = await this.axios.get(`/api/jackett?query=${encodeURIComponent(query)}&limit=1`);

    response.data.Results = response.data.Results.filter((result: Movie) => {
      if (result.Category.some((cat: string | number) => excludedCategories.includes(cat.toString()))) {
        return false;
      }
      return true;
    });
    return response.data as SearchResponse;
  }
}
