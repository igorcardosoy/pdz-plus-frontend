import { getLogtoContext } from '@logto/next/server-actions';
import { redirect } from 'next/navigation';
import { logtoConfig } from './logto';

export default async function Page() {
  const { isAuthenticated } = await getLogtoContext(logtoConfig);

  if (isAuthenticated) {
    redirect('/home');
  }

  // Redireciona para a rota apropriada da API que vai chamar o Auth Handler com permissão para cookies
  redirect('/api/auth/signin');
}
