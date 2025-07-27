'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!credentials.username || !credentials.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await login(credentials.username, credentials.password);
      router.push('/home');
    } catch (error) {
      setError('Falha no login. Verifique suas credenciais.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-base-200'>
      <div className='card w-96 bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title justify-center'>PDZ+ Login</h2>
          {error && (
            <div className='alert alert-error'>
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className='form-control w-full max-w-xs'>
              <label className='label'>
                <span className='label-text'>Usuário</span>
              </label>
              <input
                type='text'
                placeholder='Digite seu usuário'
                className='input input-bordered w-full max-w-xs'
                value={credentials.username}
                onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className='form-control w-full max-w-xs'>
              <label className='label'>
                <span className='label-text'>Senha</span>
              </label>
              <input
                type='password'
                placeholder='Digite sua senha'
                className='input input-bordered w-full max-w-xs'
                value={credentials.password}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className='card-actions justify-end mt-4'>
              <button
                type='submit'
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
