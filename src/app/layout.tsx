import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PDZ+',
  description: 'A simple movie search app',
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
