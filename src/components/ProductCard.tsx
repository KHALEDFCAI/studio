"use client";

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DollarSign, MapPin, Tag, Mail, Info } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-56">
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          data-ai-hint={product.imageHint || product.category.toLowerCase()}
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold tracking-tight">{product.name}</CardTitle>
        <div className="flex items-center text-muted-foreground text-sm pt-1">
          <MapPin className="h-4 w-4 mr-1.5" />
          {product.location}
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-3 space-y-2">
        <CardDescription className="text-sm line-clamp-3">{product.description}</CardDescription>
        <div className="flex items-center font-bold text-primary text-lg">
          <DollarSign className="h-5 w-5 mr-1" />
          {product.price.toFixed(2)}
        </div>
        <div className="text-xs text-muted-foreground flex items-center">
           <Info className="h-3.5 w-3.5 mr-1.5" /> Category: {product.category}
        </div>
        {product.tags && product.tags.length > 0 && (
          <div className="pt-1">
            <div className="flex flex-wrap gap-1.5">
              {product.tags.slice(0, 4).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                  <Tag className="h-3 w-3 mr-1" />{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full group">
              <Mail className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" /> Contact Seller
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Contact Seller</AlertDialogTitle>
              <AlertDialogDescription>
                {product.sellerEmail ? (
                  <>
                    You can reach the seller for "{product.name}" at: <a href={`mailto:${product.sellerEmail}?subject=Inquiry%20about%20${encodeURIComponent(product.name)}`} className="font-medium text-primary underline hover:text-accent">{product.sellerEmail}</a>.
                    <br />
                    Remember to be clear and courteous in your communication.
                  </>
                ) : (
                  "Seller contact information is not available for this product."
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              {product.sellerEmail && (
                <AlertDialogAction asChild>
                  <a href={`mailto:${product.sellerEmail}?subject=Inquiry%20about%20${encodeURIComponent(product.name)}`}>
                    Open Email App
                  </a>
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
