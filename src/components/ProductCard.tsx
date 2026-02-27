import { Link } from 'react-router';
import { StarIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trackEvent } from '@/lib/analytics';
import type { Product } from '@/types/product';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group block"
      onClick={() =>
        trackEvent('Product Card Clicked', {
          productId: product.id,
          productName: product.name,
          category: product.category,
          price: product.price / 100
        })
      }
    >
      <Card className="h-full overflow-hidden gap-0 py-0 transition-shadow group-hover:shadow-md">
        <div className="aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardHeader className="pt-4 pb-1">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-medium leading-snug line-clamp-2">{product.name}</CardTitle>
            <Badge variant="secondary" className="shrink-0 capitalize text-xs">
              {product.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <StarIcon className="size-3 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground/60">({product.reviewCount})</span>
          </div>
        </CardContent>
        <CardFooter className="pb-4 flex items-center justify-between">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          <div className="flex gap-1">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color.name}
                title={color.name}
                className="size-4 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
