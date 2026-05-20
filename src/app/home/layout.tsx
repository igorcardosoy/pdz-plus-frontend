import Navbar from '@/components/Navbar';
import { getLogtoContext } from '@logto/next/server-actions';
import { redirect } from 'next/navigation';
import { logtoConfig } from '../logto';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated) {
    redirect('/api/auth/signin');
  }

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} claims={claims} />
      {children}
    </>
  );
}
