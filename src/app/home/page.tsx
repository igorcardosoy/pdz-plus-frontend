'use client';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Dropdown from '@/components/Dropdown';
import Fieldset from '@/components/Fieldset';
import Input from '@/components/Input';
import Option, { DropdownOption } from '@/components/Option';
import { useAuth } from '@/hooks/useAuth';
import { JackettApi, Movie } from '@/services/JackettService';
import { Magnet, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { isAuthenticated, isLoading: isLoadingAuth, requireAuth } = useAuth();
  let api = new JackettApi();
  let [searchQuery, setSearchQuery] = useState('');
  let [searchResults, setSearchResults]: [Movie[], any] = useState([]);
  let [originalResults, setOriginalResults] = useState<Movie[]>([]);
  let [isLoading, setIsLoading] = useState(false);
  let [sortOption, setSortOption] = useState<DropdownOption['value']>('none');

  useEffect(() => {
    requireAuth();
  }, [isAuthenticated, isLoadingAuth]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSortOption = localStorage.getItem('sortOption') as DropdownOption['value'] | null;
      if (savedSortOption) {
        setSortOption(savedSortOption);
      }
    }
  }, []);

  if (isLoadingAuth) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='loading loading-spinner loading-lg'></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setOriginalResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const data = await api.searchInJackett(searchQuery);

      setOriginalResults(data.Results);
      applySorting(data.Results, sortOption);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applySorting = (results: Movie[], option: DropdownOption['value']) => {
    let sortedResults = [...results];

    if (option === 'peers') {
      sortedResults.sort((a, b) => b.Peers - a.Peers);
    } else if (option === 'seeders') {
      sortedResults.sort((a, b) => b.Seeders - a.Seeders);
    } else if (option === 'best') {
      sortedResults.sort((a, b) => {
        const scoreA = a.Peers * 0.6 + a.Seeders * 0.4;
        const scoreB = b.Peers * 0.6 + b.Seeders * 0.4;
        return scoreB - scoreA;
      });
    }

    setSearchResults(sortedResults);
  };

  const handleSortOption = (option: 'none' | 'peers' | 'seeders' | 'best') => {
    setSortOption(option);

    if (typeof window !== 'undefined') localStorage.setItem('sortOption', option);
    if (originalResults.length > 0) applySorting(originalResults, option);
  };

  return (
    <main className='flex flex-col items-center justify-baseline'>
      <section className='w-full p-4 pt-10 flex flex-col justify-center items-center'>
        <p className='text-md mb-6 text-center'>
          Aqui você pode pesquisar <span className='font-semibold'>filmes</span> e{' '}
          <span className='font-semibold'>séries</span> (talvez outras mídias também), e baixar torrents de forma fácil.
        </p>

        <Fieldset
          type='join'
          className='max-w-70 md:max-w-full'
          legend={
            <>
              <Search /> <span>Pesquisar</span>
            </>
          }
        >
          <Input
            placeholder='Digite um filme...'
            className='join-item input-neutral'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <Button
            className='join-item btn-primary'
            onClick={handleSearch}
          >
            Pesquisar
          </Button>
        </Fieldset>

        <div className='flex gap-4'>
          <Dropdown
            title='Ordenação:'
            selectedValue={sortOption}
          >
            <Option
              label='Padrão'
              description='Nenhuma (sem ordenação)'
              action={() => handleSortOption('none')}
              value='none'
            />
            <Option
              label='Peers ↓'
              description='Peers (maior para menor)'
              action={() => handleSortOption('peers')}
              value='peers'
            />
            <Option
              label='Seeders ↓'
              description='Seeders (maior para menor)'
              action={() => handleSortOption('seeders')}
              value='seeders'
            />
            <Option
              label='Combinado ⭐'
              description='Combinação de peers e seeders'
              action={() => handleSortOption('best')}
              value='best'
            />
          </Dropdown>
        </div>
      </section>

      {searchResults.length > 0 && !isLoading && (
        <div className='w-full flex justify-between items-center ml-20 mt-10'>
          <div className='text-sm text-gray-500'>Encontrados: {searchResults.length}</div>
        </div>
      )}

      <section className='card flex-row justify-center m-10 mt-4 p-6 flex-wrap gap-4'>
        {isLoading ? (
          <div className='flex flex-col items-center animate-pulse'>
            <p className='mb-6 italic text-gray-500'>
              Infelizmente o tempo de procura pode demorar um pouco, então tenha paciência.
            </p>
            <span className='loading loading-ring loading-xl'></span>
          </div>
        ) : (
          <>
            {searchResults.map((result, index) => (
              <Card
                key={index}
                title={result.Title}
                seeders={result.Seeders}
                peers={result.Peers}
                buttonText={
                  <>
                    <Magnet width={16} /> Baixar
                  </>
                }
                tracker={result.Tracker}
                link={result.MagnetUri || result.Link}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
}
