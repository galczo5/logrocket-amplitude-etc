export interface Color {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
  colors: Color[];
  featured: boolean;
  rating: number;
  reviewCount: number;
}
