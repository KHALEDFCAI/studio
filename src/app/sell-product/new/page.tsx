
// src/app/sell-product/new/page.tsx
"use client";

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { mockCategories, mockProducts } from '@/lib/mockData'; // Assuming mockProducts is needed for new ID or something
import type { Product } from '@/lib/types';

import { UploadCloud, ImagePlus, FileVideo, FileAudio, FileText, Trash2, Star, PlusCircle, DollarSign, TagsIcon } from 'lucide-react';

const productFormSchema = z.object({
  productName: z.string().min(3, { message: "Product name must be at least 3 characters." }).max(100, { message: "Product name must be 100 characters or less." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(5000, { message: "Description must be 5000 characters or less." }),
  category: z.string().min(1, { message: "Category is required." }),
  price: z.preprocess(
    (val) => parseFloat(z.string().parse(val)), // Ensure it's a string before parsing
    z.number({ invalid_type_error: "Price must be a number." }).positive({ message: "Price must be a positive number." })
  ),
  tags: z.string().optional().describe("Comma-separated tags, e.g., vintage, electronics, handmade"),
});

type ProductFormData = z.infer<typeof productFormSchema>;

// Simulate a logged-in user's email
const MOCKED_USER_EMAIL_FOR_NEW_PRODUCT = "seller1@marketmate.com";

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number | null>(null);
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: "",
      description: "",
      category: "",
      price: undefined, // or 0, depending on preference
      tags: "",
    },
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setImageFiles(prevFiles => [...prevFiles, ...filesArray]);

      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);

      if (primaryImageIndex === null && (imageFiles.length + filesArray.length > 0)) {
        setPrimaryImageIndex(0); // Auto-select first image as primary if none is set
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke object URL to free memory
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });

    if (primaryImageIndex === index) {
      setPrimaryImageIndex(newPreviews.length > 0 ? 0 : null);
    } else if (primaryImageIndex !== null && primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
  };

  const handleSingleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>) => (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setter(event.target.files[0]);
    } else {
      setter(null);
    }
  };

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsSubmitting(true);

    if (imageFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No Images Selected",
        description: "Please upload at least one image for your product.",
      });
      setIsSubmitting(false);
      return;
    }
    if (primaryImageIndex === null) {
         toast({
        variant: "destructive",
        title: "No Primary Image",
        description: "Please select a primary image for your product.",
      });
      setIsSubmitting(false);
      return;
    }


    // Simulate API call / data processing
    console.log("Product Data:", data);
    console.log("Image Files:", imageFiles.map(f => f.name));
    console.log("Primary Image:", imageFiles[primaryImageIndex]?.name || "None");
    console.log("Video File:", videoFile?.name || "None");
    console.log("Audio File:", audioFile?.name || "None");
    console.log("PDF File:", pdfFile?.name || "None");

    // Construct a mock product to show in console and potentially add to mockData (not done here)
    const newProductId = `mock-${Date.now()}`;
    const newProduct: Product = {
        id: newProductId,
        name: data.productName,
        description: data.description,
        price: data.price,
        category: data.category,
        location: "User's Location", // Placeholder
        imageUrl: imagePreviews[primaryImageIndex] || 'https://placehold.co/600x400.png', // Use primary image preview
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        sellerEmail: MOCKED_USER_EMAIL_FOR_NEW_PRODUCT, 
        imageHint: data.tags ? data.tags.split(',')[0]?.trim() : data.category.toLowerCase(),
    };
    console.log("Mock Product Object to be saved:", newProduct);
    // In a real app, you'd push `newProduct` and file data to your backend here.
    // For now, we can add it to the mockProducts array for demonstration if we imported it and had a setter,
    // but that would require more complex state management or context.

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    toast({
      title: "Product Listed!",
      description: `${data.productName} has been successfully listed for sale.`,
    });

    // Clean up object URLs
    imagePreviews.forEach(url => URL.revokeObjectURL(url));

    form.reset();
    setImageFiles([]);
    setImagePreviews([]);
    setPrimaryImageIndex(null);
    setVideoFile(null);
    setAudioFile(null);
    setPdfFile(null);
    setIsSubmitting(false);

    router.push('/sell-product');
  };

  return (
    <main className="container mx-auto px-4 py-8 sm:py-12">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-primary flex items-center">
            <PlusCircle className="mr-3 h-8 w-8" /> List a New Product
          </CardTitle>
          <CardDescription>Fill in the details below to sell your item on MarketMate.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              {/* Product Details Section */}
              <div className="space-y-4 p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-4">Product Information</h3>
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Vintage Denim Jacket" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your product in detail..." {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockCategories.filter(c => c !== "All").map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="number" placeholder="e.g., 29.99" {...field} className="pl-8" step="0.01" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                       <FormControl>
                        <div className="relative">
                           <TagsIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input placeholder="e.g., vintage, cotton, summer (comma-separated)" {...field} className="pl-8" />
                         </div>
                      </FormControl>
                      <FormDescription>Enter comma-separated tags to help buyers find your product.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4 p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-1">Product Images</h3>
                <p className="text-sm text-muted-foreground mb-4">Upload up to 5 images. Select one as the primary display image.</p>
                <FormField
                  control={form.control} // Not strictly necessary for file inputs not in schema
                  name="images" // Placeholder, not in Zod schema
                  render={({ fieldState }) => ( // Use fieldState for error display if desired
                    <FormItem>
                      <FormLabel htmlFor="image-upload" className="sr-only">Upload Images</FormLabel>
                      <FormControl>
                        <Button type="button" variant="outline" asChild className="w-full cursor-pointer">
                           <Label htmlFor="image-upload" className="flex items-center justify-center gap-2 cursor-pointer">
                            <ImagePlus className="h-5 w-5" /> Upload Images
                           </Label>
                        </Button>
                      </FormControl>
                       <Input 
                          id="image-upload"
                          type="file" 
                          accept="image/*" 
                          multiple 
                          onChange={handleImageChange} 
                          className="hidden" // Hidden, triggered by custom button
                          disabled={imageFiles.length >= 5}
                        />
                      {imageFiles.length >= 5 && <FormDescription className="text-destructive">Maximum 5 images allowed.</FormDescription>}
                      {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                    </FormItem>
                  )}
                />
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {imagePreviews.map((previewUrl, index) => (
                      <div key={index} className="relative group aspect-square border rounded-md overflow-hidden shadow">
                        <Image src={previewUrl} alt={`Preview ${index + 1}`} layout="fill" objectFit="cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleRemoveImage(index)}
                            title="Remove image"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant={primaryImageIndex === index ? "default" : "outline"}
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleSetPrimaryImage(index)}
                          >
                            <Star className={`h-3 w-3 mr-1 ${primaryImageIndex === index ? 'fill-current' : ''}`} /> Primary
                          </Button>
                        </div>
                         {primaryImageIndex === index && (
                            <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full flex items-center shadow-md">
                               <Star className="h-3 w-3 mr-1 fill-current" /> Primary
                            </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Other File Uploads Section */}
              <div className="space-y-4 p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-4">Additional Media (Optional)</h3>
                {/* Video Upload */}
                <FormItem>
                  <FormLabel htmlFor="video-upload">Product Video</FormLabel>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <Label htmlFor="video-upload" className="cursor-pointer flex items-center gap-1.5">
                        <FileVideo className="h-4 w-4" /> Choose Video
                      </Label>
                    </Button>
                    <Input id="video-upload" type="file" accept="video/*" onChange={handleSingleFileChange(setVideoFile)} className="hidden" />
                    {videoFile && <span className="text-sm text-muted-foreground truncate max-w-xs">{videoFile.name}</span>}
                  </div>
                  <FormDescription>Max 200MB. (Note: Limit not enforced on client-side)</FormDescription>
                </FormItem>

                {/* Audio Upload */}
                <FormItem>
                  <FormLabel htmlFor="audio-upload">Product Audio</FormLabel>
                   <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <Label htmlFor="audio-upload" className="cursor-pointer flex items-center gap-1.5">
                        <FileAudio className="h-4 w-4" /> Choose Audio
                      </Label>
                    </Button>
                    <Input id="audio-upload" type="file" accept="audio/*" onChange={handleSingleFileChange(setAudioFile)} className="hidden" />
                    {audioFile && <span className="text-sm text-muted-foreground truncate max-w-xs">{audioFile.name}</span>}
                  </div>
                </FormItem>

                {/* PDF Upload */}
                <FormItem>
                  <FormLabel htmlFor="pdf-upload">Product Document (PDF)</FormLabel>
                  <div className="flex items-center gap-2">
                     <Button type="button" variant="outline" size="sm" asChild>
                      <Label htmlFor="pdf-upload" className="cursor-pointer flex items-center gap-1.5">
                        <FileText className="h-4 w-4" /> Choose PDF
                      </Label>
                    </Button>
                    <Input id="pdf-upload" type="file" accept=".pdf" onChange={handleSingleFileChange(setPdfFile)} className="hidden" />
                    {pdfFile && <span className="text-sm text-muted-foreground truncate max-w-xs">{pdfFile.name}</span>}
                  </div>
                </FormItem>
              </div>

            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full sm:w-auto h-11 text-lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <UploadCloud className="mr-2 h-5 w-5 animate-pulse" /> Listing Product...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-5 w-5" /> List Product
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
}

