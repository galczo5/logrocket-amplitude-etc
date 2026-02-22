import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { StarIcon, CheckCircleIcon } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Toggle } from '@/components/ui/toggle';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '@/lib/api';
import { trackProductSelected, trackAddToCart } from '@/lib/analytics';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import type { Product, Color } from '@/types/product';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [validationMsg, setValidationMsg] = useState('');
  const [addedMsg, setAddedMsg] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setSelectedSize(null);
    setSelectedColor(null);
    setSimilarProducts([]);
    api
      .get<Product>(`/products/${id}`)
      .then((p) => {
        setProduct(p);
        // Track product view
        trackProductSelected(p.id, p.name, p.category);
        return Promise.all([Promise.resolve(p), api.get<{ products: Product[]; total: number }>('/products')]);
      })
      .then(([currentProduct, { products }]) => {
        const similar = products
          .filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)
          .slice(0, 4);
        setSimilarProducts(similar);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    if (!selectedSize || !selectedColor) {
      setValidationMsg(
        !selectedSize && !selectedColor
          ? 'Please select a size and color.'
          : !selectedSize
            ? 'Please select a size.'
            : 'Please select a color.'
      );
      return;
    }
    setValidationMsg('');
    addItem({
      productId: product!.id,
      name: product!.name,
      price: product!.price,
      size: selectedSize,
      color: selectedColor.name,
      image: product!.image
    });
    // Track add to cart
    trackAddToCart(product!.id, product!.name, product!.price / 100);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 3000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
        <p className="text-xl font-medium">Product not found.</p>
        <Button variant="outline" onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/products">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-[2/3] overflow-hidden rounded-xl bg-muted">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <h1 className="text-3xl font-bold leading-tight flex-1">{product.name}</h1>
            <Badge variant="secondary" className="capitalize shrink-0 mt-1">
              {product.category}
            </Badge>
          </div>

          <p className="text-3xl font-semibold text-primary">{formatPrice(product.price)}</p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <StarIcon className="size-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
            <span>out of 5 ({product.reviewCount} reviews)</span>
          </div>

          <Separator />

          {/* Color selector */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              Color: <span className="font-normal text-muted-foreground">{selectedColor?.name ?? '—'}</span>
            </p>
            <div className="flex gap-2">
              {product.colors.map((color) => {
                const active = selectedColor?.name === color.name;
                return (
                  <button
                    key={color.name}
                    title={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`size-8 rounded-full transition-all shadow-sm ${
                      active
                        ? 'border-2 border-primary ring-2 ring-primary ring-offset-2'
                        : 'border border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* Size selector */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Size:</p>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <Toggle
                  key={size}
                  variant="outline"
                  pressed={selectedSize === size}
                  onPressedChange={(pressed) => setSelectedSize(pressed ? size : null)}
                  className="w-12 text-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                >
                  {size}
                </Toggle>
              ))}
            </div>
          </div>

          <Separator />

          {/* Add to cart */}
          <div className="flex flex-col gap-3">
            {validationMsg && <p className="text-sm text-destructive">{validationMsg}</p>}
            {addedMsg && (
              <Alert className="border-green-500 bg-green-50 text-green-800">
                <CheckCircleIcon className="size-4 text-green-600" />
                <AlertDescription>Added to cart!</AlertDescription>
              </Alert>
            )}
            <Button size="lg" className="w-full" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <p className="text-sm font-medium mb-2">Description</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <section className="mt-16 border-t pt-16">
          <h2 className="text-2xl font-semibold mb-8">Similar Products</h2>
          <div className="grid grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
