
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { suggestTags } from '@/ai/flows/tag-product';
import { Loader2, Tags, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link'; // Import Link

const formSchema = z.object({
  description: z.string().min(20, { message: "Description must be at least 20 characters long." }).max(1000, {message: "Description must be 1000 characters or less."}),
});

type FormData = z.infer<typeof formSchema>;

export function AITagSuggester() {
  const [suggestedTagsList, setSuggestedTagsList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuggestedTagsList([]);
    try {
      const result = await suggestTags({ description: data.description });
      setSuggestedTagsList(result.tags);
    } catch (err) {
      setError("Failed to suggest tags. The AI model might be busy. Please try again later.");
      console.error("AI Tagging Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-primary" />
          AI Product Tagger
        </CardTitle>
        <CardDescription className="text-sm">Enter a product description to get AI-suggested tags. Click a tag to filter products.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description" className="text-sm font-medium">Product Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      id="description"
                      placeholder="e.g., A slightly used red bicycle, 10-speed, perfect for city cruising and light trails. Minor scratches on frame." 
                      {...field} 
                      rows={5}
                      className="mt-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-4 pt-2">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Tags className="mr-2 h-4 w-4" />}
              Suggest Tags
            </Button>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            {suggestedTagsList.length > 0 && (
              <div className="space-y-2 w-full pt-2">
                <h4 className="text-sm font-semibold text-foreground">Suggested Tags (click to filter):</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestedTagsList.map((tag, index) => (
                    <Link key={index} href={`/?q=${encodeURIComponent(tag)}`} passHref legacyBehavior>
                      <Badge
                        as="a" // Render Badge as an anchor tag because it's wrapped in Link
                        className="cursor-pointer rounded-md border border-primary bg-transparent px-3 py-1.5 text-sm text-primary hover:bg-primary hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        // Adding role="button" and tabIndex for better accessibility if not using `as="a"`
                        // but `as="a"` within Link is semantically correct.
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
