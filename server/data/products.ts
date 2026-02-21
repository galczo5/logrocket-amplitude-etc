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

export const products: Product[] = [
  {
    id: "p1",
    name: "Classic Crew Neck Tee",
    description: "A timeless crew neck t-shirt in soft 100% cotton. Perfect for everyday wear.",
    price: 1999,
    image: "https://placehold.co/400x600.png",
    category: "unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Gray", hex: "#9CA3AF" },
    ],
    featured: true,
    rating: 4.5,
    reviewCount: 312,
  },
  {
    id: "p2",
    name: "Graphic Mountain Tee",
    description: "Bold mountain graphic print on a relaxed-fit tee. Great for outdoor enthusiasts.",
    price: 2499,
    image: "https://placehold.co/400x600.png",
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Navy", hex: "#1E3A5F" },
      { name: "Forest Green", hex: "#2D6A4F" },
    ],
    featured: true,
    rating: 4.7,
    reviewCount: 198,
  },
  {
    id: "p3",
    name: "Floral V-Neck Tee",
    description: "Lightweight v-neck with a delicate floral print. Soft modal blend fabric.",
    price: 2299,
    image: "https://placehold.co/400x600.png",
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Blush", hex: "#F4A7B9" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Sage", hex: "#B7C4A8" },
    ],
    featured: false,
    rating: 4.3,
    reviewCount: 87,
  },
  {
    id: "p4",
    name: "Essential Polo",
    description: "Classic piqué polo shirt with a two-button placket. Smart-casual staple.",
    price: 3499,
    image: "https://placehold.co/400x600.png",
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#1E3A5F" },
      { name: "Red", hex: "#DC2626" },
    ],
    featured: true,
    rating: 4.6,
    reviewCount: 245,
  },
  {
    id: "p5",
    name: "Vintage Band Tee",
    description: "Retro-washed graphic tee with a worn-in feel. Oversized fit.",
    price: 2799,
    image: "https://placehold.co/400x600.png",
    category: "unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Washed Black", hex: "#2C2C2C" },
      { name: "Washed Gray", hex: "#6B7280" },
    ],
    featured: false,
    rating: 4.8,
    reviewCount: 421,
  },
  {
    id: "p6",
    name: "Striped Breton Top",
    description: "Classic Breton-style striped tee. Relaxed fit with a round neck.",
    price: 2599,
    image: "https://placehold.co/400x600.png",
    category: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Navy/White", hex: "#1E3A5F" },
      { name: "Red/White", hex: "#DC2626" },
    ],
    featured: false,
    rating: 4.4,
    reviewCount: 133,
  },
  {
    id: "p7",
    name: "Performance Dry-Fit Tee",
    description: "Moisture-wicking athletic tee with stretch fabric. Ideal for workouts.",
    price: 2999,
    image: "https://placehold.co/400x600.png",
    category: "unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Blue", hex: "#3B82F6" },
      { name: "Orange", hex: "#F97316" },
    ],
    featured: false,
    rating: 4.2,
    reviewCount: 176,
  },
  {
    id: "p8",
    name: "Pocket Tee",
    description: "Simple left-chest pocket tee in heavyweight cotton. A wardrobe essential.",
    price: 1799,
    image: "https://placehold.co/400x600.png",
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Tan", hex: "#D2B48C" },
      { name: "Slate", hex: "#64748B" },
    ],
    featured: false,
    rating: 4.1,
    reviewCount: 95,
  },
  {
    id: "p9",
    name: "Cropped Graphic Tee",
    description: "Cropped silhouette with bold front graphic. Pairs well with high-waisted bottoms.",
    price: 2199,
    image: "https://placehold.co/400x600.png",
    category: "women",
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Pink", hex: "#EC4899" },
    ],
    featured: true,
    rating: 4.6,
    reviewCount: 308,
  },
  {
    id: "p10",
    name: "Longline Tee",
    description: "Extended-length tee with a curved hem. Clean minimalist aesthetic.",
    price: 2399,
    image: "https://placehold.co/400x600.png",
    category: "unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Olive", hex: "#6B7C32" },
    ],
    featured: false,
    rating: 4.0,
    reviewCount: 62,
  },
  {
    id: "p11",
    name: "Tie-Dye Tee",
    description: "Handcrafted tie-dye pattern. Each piece is unique — no two are the same.",
    price: 3199,
    image: "https://placehold.co/400x600.png",
    category: "unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Blue/Purple", hex: "#6D28D9" },
      { name: "Pink/Yellow", hex: "#F59E0B" },
    ],
    featured: false,
    rating: 4.5,
    reviewCount: 144,
  },
  {
    id: "p12",
    name: "Pima Cotton V-Neck",
    description: "Ultra-soft Pima cotton v-neck. Lightweight and breathable for warm days.",
    price: 2699,
    image: "https://placehold.co/400x600.png",
    category: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Lavender", hex: "#C4B5FD" },
      { name: "Coral", hex: "#FB7185" },
    ],
    featured: true,
    rating: 4.9,
    reviewCount: 527,
  },
];
