
// src/app/sell-product/page.tsx
"use client";

import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { PlusCircle, ListChecks } from 'lucide-react'; // Changed Icon
import Link from 'next/link'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';


// Simulate a logged-in user's ID or email
// In a real app, this would come from an auth context/session
const MOCKED_USER_EMAIL = "seller1@marketmate.com"; 

export default function SellProductPage() {
  // Filter products to show only those by the "logged-in" user
  const userProducts = mockProducts.filter(p => p.sellerEmail === MOCKED_USER_EMAIL);

  return (
    <main className="container mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Your Product Listings</h1>
          <p className="text-muted-foreground mt-1">Manage your items for sale or add new ones.</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          {/* This would link to a form page or open a modal */}
          {/* For now, let's assume /sell-product/new is the route for a new product form */}
          <Link href="/sell-product/new"> 
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Link>
        </Button>
      </div>

      {userProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-10 sm:py-16 shadow-md border-dashed border-border">
          <CardHeader>
            <ListChecks className="mx-auto h-16 w-16 text-primary/70 mb-4" />
            <CardTitle className="text-2xl font-semibold text-foreground">No Products Listed Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-muted-foreground mb-6 max-w-md mx-auto">
              It looks like you haven't listed any products for sale. Click the button below to add your first item and start selling!
            </CardDescription>
            <Button asChild variant="default" size="lg">
              <Link href="/sell-product/new">
                <PlusCircle className="mr-2 h-5 w-5" /> List Your First Product
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
