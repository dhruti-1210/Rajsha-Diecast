import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import '../app/globals.css';

export const metadata: Metadata = {
  title: 'Rajsha Diecast | Where Dreams Drive Passion',
  description: 'Hot Wheels, Mini GT, Tarmac Works, Inno64 and more. Condition-graded diecast, shipped across India.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body><StoreProvider>{children}</StoreProvider></body>
    </html>
  );
}
