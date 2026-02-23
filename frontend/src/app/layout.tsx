import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';
import './globals.css';
import Link from 'next/link';
import { HeaderNav } from '@/components/HeaderNav';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bocalan Argentina - Gestion',
  description: 'Gestión de perros, cachorros, entrenamiento y graduados',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={plusJakarta.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-white text-black">
        <header className="sticky top-0 z-50 bg-black text-yellow-400 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors">
              <Image
                src="/images/logo.png"
                alt="Bocalan Argentina - Gestion"
                width={120}
                height={44}
                className="h-9 w-auto sm:h-11 object-contain"
                priority
              />
            </Link>
            <HeaderNav />
          </div>
        </header>
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">
          {children}
        </main>
        <footer className="border-t border-black/10 py-4 text-center text-sm text-neutral-500 bg-neutral-50">
          Bocalan Argentina - Gestion
        </footer>
      </body>
    </html>
  );
}
