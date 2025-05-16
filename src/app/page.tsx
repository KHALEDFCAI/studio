
"use client";

import { useState, useEffect, useMemo } from 'react';
import { ProductList } from '@/components/ProductList';
import { FilterBar, type Filters } from '@/components/FilterBar';
import { AITagSuggester } from '@/components/AITagSuggester';
import { mockProducts, mockCategories, mockLocations } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

export default function HomePage() {
  const searchParams = useSearchParams();
  const querySearchTerm = searchParams.get('q') || '';

  const [currentFilters, setCurrentFilters] = useState<Filters>({
    category: 'All',
    minPrice: '',
    maxPrice: '',
    location: 'All',
  });

  const [allProducts] = useState<Product[]>(mockProducts);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const searchLower = querySearchTerm.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const descriptionMatch = product.description.toLowerCase().includes(searchLower);
      const tagMatch = product.tags.some(tag => tag.toLowerCase().includes(searchLower));
      const searchPass = querySearchTerm ? (nameMatch || descriptionMatch || tagMatch) : true;

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
  }, [allProducts, querySearchTerm, currentFilters]);

  const handleFilterChange = (newFilters: Filters) => {
    setCurrentFilters(newFilters);
  };
  
  return (
    // Navbar is now in layout.tsx
    <main className="container mx-auto px-4 py-6 sm:py-8">
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
    // Footer is now in layout.tsx
  );
}
