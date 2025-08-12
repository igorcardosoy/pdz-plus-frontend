'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const CallbackContent = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const token = searchParams.get('token');
        const username = searchParams.get('username');
        const roles = searchParams.get('roles');

        if (!token || !username) {
          setStatus('error');
          setMessage('Parâmetros de autenticação inválidos');
          return;
        }

        const maxAgeSeconds = 60 * 60 * 24; // 1 dia
        document.cookie =
          `jwt=${token}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax` +
          (window.location.protocol === 'https:' ? '; Secure' : '');

        setStatus('success');
        setMessage(`Bem-vindo, ${decodeURIComponent(username)}!`);

        setTimeout(() => {
          router.push('/home');
        }, 2000);
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage('Erro ao processar login do Discord');
      }
    };

    processCallback();
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-base-200'>
        <div className='card w-96 bg-base-100 shadow-xl'>
          <div className='card-body text-center'>
            <div className='loading loading-spinner loading-lg mx-auto'></div>
            <h2 className='card-title justify-center mt-4'>Processando login...</h2>
            <p>Aguarde enquanto validamos sua autenticação do Discord.</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-base-200'>
        <div className='card w-96 bg-base-100 shadow-xl'>
          <div className='card-body text-center'>
            <div className='text-error text-6xl mb-4'>⚠️</div>
            <h2 className='card-title justify-center text-error'>Erro de Autenticação</h2>
            <p className='text-error'>{message}</p>
            <div className='card-actions justify-center mt-4'>
              <button
                className='btn btn-primary'
                onClick={() => router.push('/login')}
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-base-200'>
      <div className='card w-96 bg-base-100 shadow-xl'>
        <div className='card-body text-center flex flex-col items-center'>
          <h2 className='card-title justify-center text-success'>Login Realizado!</h2>
          <p className='text-success'>{message}</p>
          <p className='text-sm opacity-70 mt-2'>Redirecionando para a página inicial...</p>
          <div className='loading loading-dots loading-sm mt-2'></div>
        </div>
      </div>
    </div>
  );
};

const LoadingFallback = () => (
  <div className='min-h-screen flex items-center justify-center bg-base-200'>
    <div className='card w-96 bg-base-100 shadow-xl'>
      <div className='card-body text-center'>
        <div className='loading loading-spinner loading-lg mx-auto'></div>
        <h2 className='card-title justify-center mt-4'>Carregando...</h2>
        <p>Aguarde um momento.</p>
      </div>
    </div>
  </div>
);

const CallbackPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CallbackContent />
    </Suspense>
  );
};

export default CallbackPage;
