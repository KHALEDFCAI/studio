import type { Metadata } from 'next';
// import { GeistSans } from 'geist/font/sans'; // Removed to fix module not found error
// import { GeistMono } from 'geist/font/mono'; // Removed to fix module not found error
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// const geistSans = GeistSans; // Removed variable assignment for GeistSans
// const geistMono = GeistMono; // Removed variable assignment for GeistMono

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
      {/* Removed geistSans.variable and geistMono.variable from className */}
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
