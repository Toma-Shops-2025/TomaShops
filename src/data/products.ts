export interface Seller {
  id: string;
  name?: string;
  full_name?: string;
  avatar?: string;
  avatar_url?: string;
  email?: string;
  rating: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  seller?: Seller | null;
  category: string;
  condition: string;
  location: string;
  datePosted: string;
  views: number;
}
