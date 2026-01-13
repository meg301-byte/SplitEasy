import type { Metadata } from 'next';
import './globals.css';
import { EventsProvider } from '@/context/events-context';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'SplitEasy',
  description: 'Fair, transparent, and easy bill splitting.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <EventsProvider>
          <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex flex-1 flex-col items-center p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
          <Toaster />
        </EventsProvider>
      </body>
    </html>
  );
}
