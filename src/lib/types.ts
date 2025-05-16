export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  location: string;
  imageUrl: string;
  tags: string[];
  sellerEmail?: string;
  imageHint?: string; // For AI hint for placeholder images
}
