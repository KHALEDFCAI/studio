"use client";

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { ProductList } from '@/components/ProductList';
import { FilterBar, type Filters } from '@/components/FilterBar';
import { AITagSuggester } from '@/components/AITagSuggester';
import { mockProducts, mockCategories, mockLocations } from '@/lib/mockData';
import type { Product } from '@/lib/types';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilters, setCurrentFilters] = useState<Filters>({
    category: 'All',
    minPrice: '',
    maxPrice: '',
    location: 'All',
  });

  const [allProducts] = useState<Product[]>(mockProducts); // In a real app, this would be fetched

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const descriptionMatch = product.description.toLowerCase().includes(searchLower);
      const tagMatch = product.tags.some(tag => tag.toLowerCase().includes(searchLower));
      const searchPass = nameMatch || descriptionMatch || tagMatch;

      const categoryPass = currentFilters.category === 'All' || product.category === currentFilters.category;
      const locationPass = currentFilters.location === 'All' || product.location === currentFilters.location;
      
      const minPrice = parseFloat(currentFilters.minPrice);
      const maxPrice = parseFloat(currentFilters.maxPrice);
      
      let pricePass = true;
      if (!isNaN(minPrice)) {
        pricePass = pricePass && product.price >= minPrice;
      }
      if (!isNaN(maxPrice)) {
        pricePass = pricePass && product.price <= maxPrice;
      }

      return searchPass && categoryPass && locationPass && pricePass;
    });
  }, [allProducts, searchTerm, currentFilters]);

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setCurrentFilters(newFilters);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onSearchChange={handleSearchChange} initialSearchTerm={searchTerm} />
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <aside className="lg:col-span-1 space-y-8">
            <FilterBar
              categories={mockCategories}
              locations={mockLocations}
              onFilterChange={handleFilterChange}
              initialFilters={currentFilters}
            />
            <AITagSuggester />
          </aside>
          <section className="lg:col-span-3">
            <ProductList products={filteredProducts} />
          </section>
        </div>
      </main>
      <footer className="bg-secondary border-t border-border text-secondary-foreground p-6 text-center text-sm">
        © {new Date().getFullYear()} MarketMate. All rights reserved. Built with Next.js and Genkit AI.
      </footer>
    </div>
  );
}
