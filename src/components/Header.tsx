"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8">
        <Link href="/" className="text-3xl font-extrabold text-primary tracking-tight">
          MarketMate
        </Link>
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            aria-label="Search products"
            placeholder="Search products by name, description, or tags..."
            className="pl-12 pr-4 py-2.5 text-base rounded-lg"
            onChange={handleInputChange}
            defaultValue={initialSearchTerm}
          />
        </div>
      </div>
    </header>
  );
}
