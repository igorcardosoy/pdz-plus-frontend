import { Movie } from '@/services/JackettService';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const limit = searchParams.get('limit') || '1';

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    if (!process.env.JACKETT_API_URL || !process.env.JACKETT_API_KEY) {
      return NextResponse.json({ error: 'Jackett API configuration is missing' }, { status: 500 });
    }

    const response = await axios.get(`${process.env.JACKETT_API_URL}/api/v2.0/indexers/all/results`, {
      params: {
        query: query,
        limit: limit,
        apikey: process.env.JACKETT_API_KEY,
      },
    });

    const filteredResults = response.data.Results.filter((result: Movie) => {
      if (result.Category.some((cat: string | number) => excludedCategories.includes(cat.toString()))) {
        return false;
      }
      return true;
    });

    return NextResponse.json({
      ...response.data,
      Results: filteredResults,
    });
  } catch (error) {
    console.error('Error searching in Jackett:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: 'Failed to fetch from Jackett API',
          details: error.message,
          status: error.response?.status || 500,
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
