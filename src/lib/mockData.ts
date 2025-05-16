
import type { Product } from './types';

// IMPORTANT: mockProducts is changed to 'let' and directly mutated 
// by other parts of the application (e.g., NewProductPage) for client-side 
// simulation purposes. In a real application, this would be handled by API calls 
// to a backend and a proper state management solution.
export let mockProducts: Product[] = [
  {
    id: '1',
    name: 'Vintage Leather Jacket',
    description: 'A stylish vintage leather jacket, gently used. Brown, size M. Perfect for a cool retro look that never goes out of style.',
    price: 75.00,
    category: 'Apparel',
    location: 'New York, NY',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'leather jacket',
    tags: ['vintage', 'leather', 'jacket', 'fashion', 'retro'],
    sellerEmail: 'seller1@marketmate.com',
  },
  {
    id: '2',
    name: 'Modern Ergonomic Chair',
    description: 'Barely used ergonomic office chair. Black mesh back, adjustable height and lumbar support. Excellent for home office.',
    price: 120.50,
    category: 'Furniture',
    location: 'London, UK',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'office chair',
    tags: ['office', 'furniture', 'ergonomic', 'chair', 'modern'],
    sellerEmail: 'seller2@marketmate.com',
  },
  {
    id: '3',
    name: 'Collectible Action Figure',
    description: 'Rare limited edition action figure, still in original packaging. A must-have for collectors.',
    price: 45.99,
    category: 'Collectibles',
    location: 'Tokyo, JP',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'action figure',
    tags: ['collectible', 'toy', 'action figure', 'limited edition'],
    sellerEmail: 'seller3@marketmate.com',
  },
  {
    id: '4',
    name: 'Acoustic Guitar Set',
    description: 'Beginner acoustic guitar with case, picks, and tuner. Great condition, hardly played. Ideal for learning.',
    price: 90.00,
    category: 'Musical Instruments',
    location: 'Berlin, DE',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'acoustic guitar',
    tags: ['guitar', 'music', 'instrument', 'acoustic', 'beginner'],
    // sellerEmail deliberately omitted for one item
  },
  {
    id: '5',
    name: 'Professional DSLR Camera',
    description: 'Used DSLR camera body with kit lens. Works perfectly, minor cosmetic wear. Includes battery and charger.',
    price: 350.00,
    category: 'Electronics',
    location: 'Paris, FR',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'dslr camera',
    tags: ['camera', 'dslr', 'electronics', 'photography', 'professional'],
    sellerEmail: 'sellerphotos@marketmate.com',
  },
  {
    id: '6',
    name: 'Set of Classic Novels',
    description: 'Collection of 5 classic novels, hardcover editions. Lightly read, excellent condition. Includes titles by famous authors.',
    price: 25.00,
    category: 'Books',
    location: 'New York, NY',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'book collection',
    tags: ['books', 'novels', 'classic', 'literature', 'hardcover'],
    sellerEmail: 'booklover@marketmate.com',
  },
];

export const mockCategories: string[] = ['All', 'Apparel', 'Electronics', 'Furniture', 'Collectibles', 'Musical Instruments', 'Books', 'Other'];
export const mockLocations: string[] = ['All', 'New York, NY', 'London, UK', 'Paris, FR', 'Tokyo, JP', 'Berlin, DE'];
