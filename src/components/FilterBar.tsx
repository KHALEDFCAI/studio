"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw } from 'lucide-react';

export interface Filters {
  category: string;
  minPrice: string;
  maxPrice: string;
  location: string;
}

interface FilterBarProps {
  categories: string[];
  locations: string[];
  onFilterChange: (filters: Filters) => void;
  initialFilters?: Partial<Filters>;
}

export function FilterBar({ categories, locations, onFilterChange, initialFilters = {} }: FilterBarProps) {
  const [category, setCategory] = useState(initialFilters.category || 'All');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || '');
  const [location, setLocation] = useState(initialFilters.location || 'All');

  const handleApplyFilters = () => {
    onFilterChange({ category, minPrice, maxPrice, location });
  };

  const handleResetFilters = () => {
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setLocation('All');
    onFilterChange({ category: 'All', minPrice: '', maxPrice: '', location: 'All' });
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center">
          <Filter className="h-5 w-5 mr-2 text-primary" />
          Filter Products
        </CardTitle>
        <CardDescription className="text-sm">Refine your search</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="category" className="text-sm font-medium">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm font-medium">Price Range ($)</Label>
          <div className="flex space-x-2 mt-1">
            <Input 
              id="minPrice" 
              type="number" 
              placeholder="Min" 
              value={minPrice} 
              onChange={e => setMinPrice(e.target.value)} 
              aria-label="Minimum price"
              min="0"
            />
            <Input 
              id="maxPrice" 
              type="number" 
              placeholder="Max" 
              value={maxPrice} 
              onChange={e => setMaxPrice(e.target.value)} 
              aria-label="Maximum price"
              min="0"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="location" className="text-sm font-medium">Location</Label>
           <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location" className="mt-1">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
          <Button onClick={handleResetFilters} variant="outline" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
