
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, MapPin, Tag, Info, ShoppingBag as ShoppingBagIcon } from 'lucide-react';
import { useBag } from '@/contexts/BagContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToBag } = useBag();

  const handleAddToBag = () => {
    addToBag(product);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-56">
        <Link href={`/product/${product.id}`} passHref>
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="cursor-pointer"
            data-ai-hint={product.imageHint || product.category.toLowerCase()}
          />
        </Link>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold tracking-tight">
          <Link href={`/product/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
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
        <Button variant="default" className="w-full group" onClick={handleAddToBag}>
            <ShoppingBagIcon className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" /> Add to Bag
        </Button>
      </CardFooter>
    </Card>
  );
}
