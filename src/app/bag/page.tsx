
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useBag } from '@/contexts/BagContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag as ShoppingBagIconPage, ArrowLeft, CreditCard } from 'lucide-react'; // Renamed ShoppingBag
import { useToast } from '@/hooks/use-toast';

export default function BagPage() {
  const { bagItems, removeFromBag, updateQuantity, getBagTotal, clearBag, getBagItemCount } = useBag();
  const { toast } = useToast();

  const handleQuantityChange = (productId: string, value: string) => {
    const newQuantity = parseInt(value, 10);
    if (isNaN(newQuantity)) { // Handle invalid input gracefully
        updateQuantity(productId, 1); // Or keep current quantity
        return;
    }
    if (newQuantity < 1) {
      // Consider a confirmation dialog before removing if quantity is set to 0 or less
      // For now, directly remove or set to minimum 1 if preferred.
      // Let's make it so that it can't go below 1 via input, but can be removed by trash icon.
      updateQuantity(productId, 1); 
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    toast({
      title: "Checkout Initiated (Simulated)",
      description: "In a real app, you would proceed to payment processing.",
    });
    // clearBag(); // Optionally clear bag after initiating checkout
  };

  if (bagItems.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8 sm:py-12 text-center flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"> {/* Adjust min-h for better centering */}
        <ShoppingBagIconPage className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-4">Your Bag is Empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">Looks like you haven't added any products to your bag yet. Explore our marketplace and find something you like!</p>
        <Button asChild size="lg" className="text-lg">
          <Link href="/">
            <ArrowLeft className="mr-2 h-5 w-5" /> Start Shopping
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">Your Shopping Bag</h1>
        {bagItems.length > 0 && (
          <Button variant="outline" onClick={clearBag} className="w-full sm:w-auto">
            <Trash2 className="mr-2 h-4 w-4" /> Clear Bag
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <section className="lg:col-span-2 space-y-6">
          {bagItems.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="relative w-full sm:w-28 h-36 sm:h-28 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={item.imageHint || item.category.toLowerCase()}
                />
              </div>
              <div className="flex-grow">
                <Link href={`/product/${item.id}`} className="hover:text-primary transition-colors">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                </Link>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <p className="text-lg font-semibold text-primary mt-1">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-3 sm:mt-0 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <label htmlFor={`quantity-${item.id}`} className="text-sm font-medium">Qty:</label>
                  <Input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="w-20 h-9 text-center appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFromBag(item.id)} 
                    aria-label={`Remove ${item.name} from bag`}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </section>

        <aside className="lg:col-span-1">
          <Card className="shadow-xl sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-base">
                <span>Subtotal ({getBagItemCount()} items)</span>
                <span className="font-semibold">${getBagTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>FREE</span> 
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-xl font-bold">
                <span>Estimated Total</span>
                <span>${getBagTotal().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full h-12 text-lg" onClick={handleCheckout}>
                <CreditCard className="mr-2 h-5 w-5" /> Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </main>
  );
}
