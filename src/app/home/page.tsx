'use client';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Fieldset from '@/components/Fieldset';
import Input from '@/components/Input';
import SortDropdown from '@/components/SortDropdown';
import { useAuth } from '@/hooks/useAuth';
import { JackettApi, Movie } from '@/services/JackettService';
import { Magnet, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { isAuthenticated, isLoading, requireAuth } = useAuth();
  let api = new JackettApi();
  let [searchQuery, setSearchQuery] = useState('');
  let [searchResults, setSearchResults]: [Movie[], any] = useState([]);
  let [originalResults, setOriginalResults] = useState<Movie[]>([]);
  let [loading, setLoading] = useState(false);
  let [sortOption, setSortOption] = useState<'none' | 'peers' | 'seeders' | 'best'>('best');

  useEffect(() => {
    requireAuth();
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
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
      setSortOption('best');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await api.searchInJackett(searchQuery);

      setOriginalResults(data.Results);
      applySorting(data.Results, sortOption);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySorting = (results: Movie[], option: 'none' | 'peers' | 'seeders' | 'best') => {
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

    if (originalResults.length > 0) {
      applySorting(originalResults, option);
    }
  };

  return (
    <main className='flex flex-col items-center justify-baseline'>
      <section className='w-full p-4 flex flex-col justify-center items-center'>
        <p className='text-md mb-6 text-center'>
          Aqui você pode pesquisar <span className='font-semibold'>filmes</span> e{' '}
          <span className='font-semibold'>séries</span> (talvez outras mídias também), e baixar torrents de forma rápida
          e fácil.
        </p>

        <Fieldset
          type='join'
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
            className='join-item btn-primary btn-soft'
            onClick={handleSearch}
          >
            Pesquisar
          </Button>
        </Fieldset>

        <SortDropdown
          sortOption={sortOption}
          onSortChange={handleSortOption}
        />
      </section>

      <section className='card flex-row justify-center m-10 p-6 flex-wrap gap-4'>
        {loading ? (
          <span className='loading loading-ring loading-xl'></span>
        ) : (
          searchResults.map((result, index) => (
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
          ))
        )}
      </section>
    </main>
  );
}
