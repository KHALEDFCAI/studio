
"use client";

import type { Product } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface BagItem extends Product {
  quantity: number;
}

interface BagContextType {
  bagItems: BagItem[];
  addToBag: (product: Product) => void;
  removeFromBag: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearBag: () => void;
  getBagTotal: () => number;
  getBagItemCount: () => number;
}

const BagContext = createContext<BagContextType | undefined>(undefined);

export const BagProvider = ({ children }: { children: ReactNode }) => {
  // Always initialize with an empty array for consistent server/client initial render
  const [bagItems, setBagItems] = useState<BagItem[]>([]);
  const { toast } = useToast();

  // Effect to load items from localStorage on initial client mount
  useEffect(() => {
    const storedBag = localStorage.getItem('marketmateBag');
    if (storedBag) {
      try {
        const parsedBag = JSON.parse(storedBag);
        if (Array.isArray(parsedBag)) { // Basic validation
          setBagItems(parsedBag);
        } else {
          console.error("Stored bag in localStorage was not an array:", parsedBag);
          localStorage.removeItem('marketmateBag'); // Clear potentially corrupted data
        }
      } catch (error) {
        console.error("Error parsing bag from localStorage on mount:", error);
        localStorage.removeItem('marketmateBag'); // Clear corrupted data
      }
    }
  }, []); // Empty dependency array ensures this runs once on client mount

  // Effect to save items to localStorage whenever bagItems change
  useEffect(() => {
    // This check is good practice, though this effect runs client-side after mount
    if (typeof window !== 'undefined') {
      localStorage.setItem('marketmateBag', JSON.stringify(bagItems));
    }
  }, [bagItems]);


  const addToBag = (product: Product) => {
    setBagItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        toast({
          title: "Item Updated in Bag",
          description: `${product.name} quantity increased.`,
        });
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        toast({
          title: "Item Added to Bag",
          description: `${product.name} has been added to your bag.`,
        });
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromBag = (productId: string) => {
    setBagItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast({
          title: "Item Removed",
          description: `${itemToRemove.name} has been removed from your bag.`,
          variant: "destructive"
        });
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setBagItems(prevItems => {
      if (quantity < 1) {
        // If quantity is less than 1, remove the item
        const itemToRemove = prevItems.find(item => item.id === productId);
        if (itemToRemove) {
          toast({
            title: "Item Removed",
            description: `${itemToRemove.name} has been removed from your bag.`,
            variant: "destructive"
          });
        }
        return prevItems.filter(item => item.id !== productId);
      }
      // Otherwise, update the quantity
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity: quantity } : item
      );
    });
  };

  const clearBag = () => {
    setBagItems([]);
    toast({
      title: "Bag Cleared",
      description: "All items have been removed from your bag.",
    });
  };

  const getBagTotal = () => {
    return bagItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getBagItemCount = () => {
    return bagItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <BagContext.Provider value={{ bagItems, addToBag, removeFromBag, updateQuantity, clearBag, getBagTotal, getBagItemCount }}>
      {children}
    </BagContext.Provider>
  );
};

export const useBag = () => {
  const context = useContext(BagContext);
  if (context === undefined) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return context;
};
