
// src/app/product/[id]/page.tsx
"use client";

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { mockProducts } from '@/lib/mockData';
import type { Product as ProductType } from '@/lib/types'; // Renamed to avoid conflict
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductCard } from '@/components/ProductCard';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider"; // Import Slider
import { Separator } from '@/components/ui/separator';
import { DollarSign, MapPin, Tag, Mail, Info, Star, MessageSquare, Send, ThumbsUp, Search } from 'lucide-react';

// Mock comments structure
interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<ProductType | null>(null);
  const [currentRating, setCurrentRating] = useState<number>(3); // Default rating for slider
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      // Mock initial comments for the product
      setComments([
        { id: 'c1', user: 'User123', avatar: 'https://placehold.co/40x40.png?text=U1', text: 'Great product, exactly as described!', timestamp: '2 days ago' },
        { id: 'c2', user: 'BuyerXYZ', avatar: 'https://placehold.co/40x40.png?text=BX', text: 'Interested. Is the price negotiable?', timestamp: '1 day ago' },
      ]);
    } else {
      // Handle product not found, e.g., redirect to a 404 page or homepage
      // router.push('/not-found'); For now, just log
      console.error("Product not found");
    }
  }, [productId, router]);

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    const newCommentObj: Comment = {
      id: `c${comments.length + 1}`,
      user: 'CurrentUser', // Simulate current user
      avatar: 'https://placehold.co/40x40.png?text=ME',
      text: newComment,
      timestamp: 'Just now',
    };
    setComments(prevComments => [newCommentObj, ...prevComments]);
    setNewComment('');
  };

  const suggestedProducts = useMemo(() => {
    if (!product) return [];

    const currentProductTokens = `${product.name.toLowerCase()} ${product.description.toLowerCase()}`.split(/\s+/);

    return mockProducts
      .filter(p => p.id !== product.id) // Exclude the current product
      .map(suggestedP => {
        let score = 0;
        // Category match
        if (suggestedP.category === product.category) {
          score += 5;
        }
        // Tag match
        product.tags.forEach(tag => {
          if (suggestedP.tags.includes(tag)) {
            score += 2;
          }
        });
        // Name/description keyword match (simple)
        const suggestedProductTokens = `${suggestedP.name.toLowerCase()} ${suggestedP.description.toLowerCase()}`.split(/\s+/);
        currentProductTokens.forEach(token => {
          if (token.length > 2 && suggestedProductTokens.includes(token)) { // avoid common short words
            score += 1;
          }
        });
        return { ...suggestedP, relevanceScore: score };
      })
      .filter(p => p.relevanceScore > 0) // Only include products with some relevance
      .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sort by score
      .slice(0, 4); // Take top 4 suggestions
  }, [product]);

  if (!product) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading product details or product not found...</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column: Image and Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl overflow-hidden">
            <div className="relative w-full h-80 sm:h-96 md:h-[500px] bg-muted">
              <Image
                src={product.imageUrl}
                alt={product.name}
                layout="fill"
                objectFit="contain" // Use contain to see the whole image
                className="rounded-t-lg"
                data-ai-hint={product.imageHint || product.category.toLowerCase()}
              />
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight">{product.name}</CardTitle>
              <div className="flex items-center text-muted-foreground text-sm pt-1">
                <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                {product.location}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-3xl font-bold text-primary">
                <DollarSign className="h-7 w-7 mr-1.5" />
                {product.price.toFixed(2)}
              </div>
              <p className="text-base text-foreground/90 leading-relaxed">{product.description}</p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                 <Badge variant="outline" className="text-sm py-1 px-2.5 flex items-center">
                    <Info className="h-4 w-4 mr-1.5" /> Category: {product.category}
                  </Badge>
                {product.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-sm py-1 px-2.5">
                    <Tag className="h-3.5 w-3.5 mr-1.5" />{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
             <CardFooter className="pt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="default" size="lg" className="w-full sm:w-auto">
                      <Mail className="h-5 w-5 mr-2" /> Contact Seller
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
        </div>

        {/* Right Column: Rating, Comments, Suggestions */}
        <div className="lg:col-span-1 space-y-8">
          {/* Rating Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><ThumbsUp className="mr-2 h-5 w-5 text-primary"/>Rate this Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Your Rating:</span>
                <div className="flex items-center font-semibold text-lg text-primary">
                  {currentRating.toFixed(1)} <Star className="ml-1 h-5 w-5 fill-current" />
                </div>
              </div>
              <Slider
                defaultValue={[currentRating]}
                max={5}
                step={0.5} // Allow half-star ratings
                min={0.5} // Minimum rating
                onValueChange={(value) => setCurrentRating(value[0])}
                aria-label="Product rating slider"
              />
               <Button variant="outline" className="w-full mt-2" onClick={() => alert(`Rating submitted: ${currentRating} stars (simulated)`)}>
                Submit Rating
              </Button>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary"/>Comments ({comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="Write your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  aria-label="New comment"
                />
                <Button onClick={handleAddComment} className="w-full" disabled={!newComment.trim()}>
                  <Send className="mr-2 h-4 w-4"/>Post Comment
                </Button>
              </div>
              <Separator />
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {comments.length > 0 ? comments.map(comment => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={comment.avatar} alt={comment.user} data-ai-hint="avatar user" />
                      <AvatarFallback>{comment.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">{comment.user}</p>
                        <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                      </div>
                      <p className="text-sm text-foreground/90 mt-1">{comment.text}</p>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>}
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>

      {/* Suggested Products Section - Full Width Below */}
      {suggestedProducts.length > 0 && (
        <div className="mt-12 lg:mt-16">
          <Separator className="my-8" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 flex items-center">
            <Search className="mr-3 h-7 w-7 text-primary" /> You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {suggestedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

