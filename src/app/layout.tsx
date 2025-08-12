import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PDZ+',
  description: 'Uma plataforma para busca e download de torrents de filmes e séries, para PDZ.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='pt-BR'
      data-theme='pdz'
    >
      <body>{children}</body>
    </html>
  );
}
