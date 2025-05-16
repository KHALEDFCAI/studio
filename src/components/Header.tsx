
"use client";

import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react"; // Added User icon
import Link from "next/link";
import type { ChangeEvent } from 'react';

interface HeaderProps {
  onSearchChange: (searchTerm: string) => void;
  initialSearchTerm?: string;
}

export function Header({ onSearchChange, initialSearchTerm = "" }: HeaderProps) {
  
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="text-3xl font-extrabold text-primary tracking-tight">
          MarketMate
        </Link>
        
        <div className="flex items-center gap-3 w-full sm:w-auto"> {/* Container for search and profile icon */}
          <div className="relative flex-grow sm:flex-grow-0 w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              aria-label="Search products"
              placeholder="Search products by name, description, or tags..."
              className="pl-12 pr-4 py-2.5 text-base rounded-lg w-full"
              onChange={handleInputChange}
              defaultValue={initialSearchTerm}
            />
          </div>
          <Link 
            href="/auth" 
            aria-label="User profile and authentication"
            className="flex items-center justify-center p-2 rounded-full text-primary hover:bg-accent/20 transition-colors"
          >
            <User className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}
