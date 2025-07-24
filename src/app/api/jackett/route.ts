import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const jackettUrl = process.env.JACKETT_API_URL || 'http://localhost:9117';
    const apiKey = process.env.JACKETT_API_KEY;
    let url = `${jackettUrl}/api/v2.0/indexers/all/results?query=${encodeURIComponent(query)}`;

    if (apiKey) {
      url += `&apikey=${apiKey}`;
    }

    console.log('Fazendo requisição para:', url);

    const response = await axios.get(url, {
      timeout: 60000, // 60 segundos para dar tempo ao Jackett
      headers: {
        'User-Agent': 'PDZ-Plus/1.0',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Erro detalhado ao buscar no Jackett:', error);

    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        {
          error: 'Não foi possível conectar ao servidor Jackett. Verifique se está rodando.',
        },
        { status: 503 }
      );
    }

    if (error.response?.status === 401) {
      return NextResponse.json(
        {
          error: 'Não autorizado. Verifique se a API key do Jackett está correta.',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: `Erro interno do servidor: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
