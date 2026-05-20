'use client';

import Card from '@/components/Card';
import { historyService, MovieHistoryDTO } from '@/services/HistoryService';
import { Magnet } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HistoryPage() {
  const [history, setHistory] = useState<MovieHistoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await historyService.getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await historyService.deleteFromHistory(id);
      setHistory(history.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao deletar do histórico:', error);
    }
  };

  const handleRedownload = async (item: MovieHistoryDTO) => {
    try {
      await historyService.addToHistory(item.movie);
    } catch (error) {
      console.error('Erro ao readicionar ao histórico:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className='flex flex-col items-center justify-start min-h-screen'>
      <section className='w-full p-4 pt-10 flex flex-col justify-center items-center'>
        <h1 className='text-3xl font-bold mb-2'>Histórico de Downloads</h1>
        <p className='text-md text-gray-600 text-center mb-8'>
          Aqui estão todos os filmes e séries que você baixou
        </p>
      </section>

      {isLoading ? (
        <div className='flex flex-col items-center justify-center min-h-96'>
          <span className='loading loading-spinner loading-xl'></span>
          <p className='mt-4 text-gray-500'>Carregando histórico...</p>
        </div>
      ) : history.length === 0 ? (
        <div className='flex flex-col items-center justify-center min-h-96'>
          <p className='text-xl text-gray-500 text-center'>
            Você ainda não tem nenhum download no histórico
          </p>
          <p className='text-sm text-gray-400 mt-2'>
            Volte para a home e faça um download para que apareça aqui
          </p>
        </div>
      ) : (
        <section className='w-full flex justify-center m-10 p-6'>
          <div className='flex flex-wrap gap-4 justify-center max-w-7xl'>
            {history.map((item) => (
              <div key={item.id} className='relative'>
                <Card
                  title={item.movie.Title}
                  providers={item.movie.Providers}
                  description={item.movie.Description}
                  buttonText={
                    <>
                      <Magnet width={16} /> Baixar Novamente
                    </>
                  }
                  tracker={item.movie.Tracker}
                  link={item.movie.MagnetUri || item.movie.Link}
                  onButtonClick={() => handleRedownload(item)}
                  showDeleteButton={true}
                  onDeleteClick={() => handleDelete(item.id)}
                  buttonSize='sm'
                />
                <div className='text-xs text-gray-500 mt-2 text-center px-4'>
                  {formatDate(item.downloadedAt)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
