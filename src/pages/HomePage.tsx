import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi
} from '@/components/ui/carousel';
import ProductCard from '@/components/ProductCard';
import { api } from '@/lib/api';
import type { Product } from '@/types/product';
import { trackEvent } from '@/lib/analytics';

const HERO_SLIDES = [
  {
    image: '/images/home/hero-slide-1-premium-tshirts.png',
    heading: 'Premium T-Shirts for Everyone',
    sub: 'Discover our collection of comfortable, stylish tees'
  },
  {
    image: '/images/home/hero-slide-2-new-arrivals.png',
    heading: 'New Arrivals Just Dropped',
    sub: 'Fresh styles added every week — be the first to wear them'
  },
  {
    image: '/images/home/hero-slide-3-quality-fabrics.png',
    heading: 'Quality You Can Feel',
    sub: 'Soft fabrics, lasting colours, and fits for every body'
  }
];

const CATEGORIES = [
  {
    key: 'men',
    label: "Men's Collection",
    image: '/images/home/category-mens-collection.png',
    description: 'Classic cuts and bold graphics for everyday wear.'
  },
  {
    key: 'women',
    label: "Women's Collection",
    image: '/images/home/category-womens-collection.png',
    description: 'Soft fabrics and flattering fits for every occasion.'
  },
  {
    key: 'unisex',
    label: 'Unisex Collection',
    image: '/images/home/category-unisex-collection.png',
    description: 'Relaxed silhouettes designed for everyone.'
  }
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    trackEvent('Navigated to Home', { route: '/' });
  }, []);

  useEffect(() => {
    api
      .get<{ products: Product[]; total: number }>('/products')
      .then(({ products }) => setFeatured(products.filter((p) => p.featured).slice(0, 4)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!carouselApi) return;

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselApi]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative">
        <Carousel opts={{ loop: true }} setApi={setCarouselApi} className="w-full">
          <CarouselContent>
            {HERO_SLIDES.map((slide, i) => (
              <CarouselItem key={i}>
                <div className="relative h-[540px] overflow-hidden">
                  <img src={slide.image} alt={slide.heading} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col items-center justify-center text-white text-center px-8">
                    <h1 className="text-5xl font-bold tracking-tight mb-4 drop-shadow">{slide.heading}</h1>
                    <p className="text-lg text-slate-200 mb-8 drop-shadow">{slide.sub}</p>
                    <Button asChild size="lg" variant="secondary">
                      <Link to="/products">
                        Shop All <ArrowRightIcon className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-6 size-10 bg-white/20 hover:bg-white/40 border-white/30 text-white" />
          <CarouselNext className="right-6 size-10 bg-white/20 hover:bg-white/40 border-white/30 text-white" />
        </Carousel>
      </section>

      {/* Category cards */}
      <section className="py-16 px-8">
        <h2 className="text-2xl font-semibold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link key={cat.key} to={`/products?category=${cat.key}`} className="group block">
              <Card className="overflow-hidden h-full gap-0 py-0 transition-shadow group-hover:shadow-md">
                <div className="h-48 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardHeader className="pt-4 pb-1">
                  <CardTitle className="text-base">{cat.label}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
                    Shop now <ArrowRightIcon className="size-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="py-16 px-8 bg-muted/30">
        <h2 className="text-2xl font-semibold mb-8">Featured Products</h2>
        <div className="grid grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
