
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from '@/components/Navbar';
import { BagProvider } from '@/contexts/BagContext'; // Import BagProvider

export const metadata: Metadata = {
  title: 'MarketMate - Your Used Products Marketplace',
  description: 'Discover and sell used products with MarketMate. Features AI tagging, smart search, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <BagProvider> {/* Wrap with BagProvider */}
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <Toaster />
          <footer className="bg-secondary border-t border-border text-secondary-foreground p-6 text-center text-sm">
            © {new Date().getFullYear()} MarketMate. All rights reserved. Built with Next.js and Genkit AI.
          </footer>
        </BagProvider>
      </body>
    </html>
  );
}
