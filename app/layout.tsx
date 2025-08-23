import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'GitHub Roaster 🔥 - Roast Your GitHub Activity',
  description: 'Get absolutely roasted based on your GitHub contributions, commit messages, and coding habits. Built with Next.js and Aceternity UI.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`min-h-screen antialiased ${inter.className}`}>
        {children}
        <Toaster 
          position="top-center" 
          richColors
          theme="dark"
        />
      </body>
    </html>
  );
}
