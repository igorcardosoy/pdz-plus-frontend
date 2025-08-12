'use client';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/AuthService';
import { Lock, User } from 'lucide-react';
import Image from 'next/image';
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
          <h2 className='card-title justify-center m-6'>PDZ+</h2>
          {error && (
            <div className='alert alert-error max-w-70 self-center mb-2'>
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className='flex flex-col gap-4'>
              <Input
                placeholder='Digite seu usuário'
                value={credentials.username}
                onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                disabled={isLoading}
                icon={<User />}
              />
              <Input
                placeholder='Digite sua senha'
                type='password'
                value={credentials.password}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                disabled={isLoading}
                icon={<Lock />}
              />
            </div>

            <div className='card-actions justify-end mt-4'>
              <Button
                type='button'
                onClick={() => {
                  authService.loginWithCallback('https://pdz-plus.localto.net/callback');
                }}
              >
                <Image
                  src='/discord-icon.svg'
                  alt='Discord Logo'
                  width={20}
                  height={20}
                />
                Entrar com Discord
              </Button>
              <Button
                type='submit'
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
