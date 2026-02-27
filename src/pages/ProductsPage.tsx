import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import ProductCard from '@/components/ProductCard';
import FilterSidebar, { type FilterValues } from '@/components/FilterSidebar';
import { api } from '@/lib/api';
import { trackSearch, trackEvent } from '@/lib/analytics';
import type { Product } from '@/types/product';

const EMPTY_FILTERS: FilterValues = {
  categories: [],
  sizes: [],
  colors: [],
  minPrice: '',
  maxPrice: ''
};

function filtersToParams(filters: FilterValues, sort: string, search: string): URLSearchParams {
  const p = new URLSearchParams();
  filters.categories.forEach((c) => p.append('category', c));
  filters.sizes.forEach((s) => p.append('size', s));
  filters.colors.forEach((c) => p.append('color', c));
  if (filters.minPrice) p.set('minPrice', filters.minPrice);
  if (filters.maxPrice) p.set('maxPrice', filters.maxPrice);
  if (sort) p.set('sort', sort);
  if (search) p.set('search', search);
  return p;
}

function paramsToFilters(p: URLSearchParams): FilterValues {
  return {
    categories: p.getAll('category'),
    sizes: p.getAll('size'),
    colors: p.getAll('color'),
    minPrice: p.get('minPrice') ?? '',
    maxPrice: p.get('maxPrice') ?? ''
  };
}

function buildApiQuery(filters: FilterValues, sort: string, search: string): string {
  const p = new URLSearchParams();
  // API supports single values — multi-select is handled client-side
  if (filters.categories.length === 1) p.set('category', filters.categories[0]);
  if (filters.sizes.length === 1) p.set('size', filters.sizes[0]);
  if (filters.colors.length === 1) p.set('color', filters.colors[0]);
  if (filters.minPrice) p.set('minPrice', filters.minPrice);
  if (filters.maxPrice) p.set('maxPrice', filters.maxPrice);
  if (sort) p.set('sort', sort);
  if (search) p.set('search', search);
  const qs = p.toString();
  return qs ? `?${qs}` : '';
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<FilterValues>(() => paramsToFilters(searchParams));
  const [sort, setSort] = useState(searchParams.get('sort') ?? '');
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback((f: FilterValues, s: string, q: string) => {
    setLoading(true);
    api
      .get<{ products: Product[]; total: number }>(`/products${buildApiQuery(f, s, q)}`)
      .then(({ products: raw }) => {
        let result = raw;
        if (f.categories.length > 1) result = result.filter((p) => f.categories.includes(p.category));
        if (f.sizes.length > 1) result = result.filter((p) => f.sizes.some((sz) => p.sizes.includes(sz)));
        if (f.colors.length > 1)
          result = result.filter((p) =>
            f.colors.some((col) => p.colors.some((c) => c.name.toLowerCase() === col.toLowerCase()))
          );
        setProducts(result);
        setTotal(result.length);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSearchParams(filtersToParams(filters, sort, search), { replace: true });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts(filters, sort, search);
      // Track search/filter event
      if (search || Object.values(filters).some((v) => (Array.isArray(v) ? v.length > 0 : v))) {
        trackSearch(search, {
          categories: filters.categories,
          sizes: filters.sizes,
          colors: filters.colors,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sort
        });
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, sort, search]); // eslint-disable-line react-hooks/exhaustive-deps

  function clearAll() {
    setFilters(EMPTY_FILTERS);
    setSort('');
    setSearch('');
  }

  function removeFilter(type: string, value?: string) {
    trackEvent('Filter Removed', { filterType: type, value });
    if (type === 'category') setFilters((f) => ({ ...f, categories: f.categories.filter((c) => c !== value) }));
    else if (type === 'size') setFilters((f) => ({ ...f, sizes: f.sizes.filter((s) => s !== value) }));
    else if (type === 'color') setFilters((f) => ({ ...f, colors: f.colors.filter((c) => c !== value) }));
    else if (type === 'price') setFilters((f) => ({ ...f, minPrice: '', maxPrice: '' }));
    else if (type === 'search') setSearch('');
    else if (type === 'sort') setSort('');
  }

  const activeBadges: { label: string; type: string; value?: string }[] = [
    ...filters.categories.map((c) => ({ label: c, type: 'category', value: c })),
    ...filters.sizes.map((s) => ({ label: `Size: ${s}`, type: 'size', value: s })),
    ...filters.colors.map((c) => ({ label: c, type: 'color', value: c })),
    ...(filters.minPrice || filters.maxPrice
      ? [{ label: `$${filters.minPrice || '0'} – $${filters.maxPrice || '∞'}`, type: 'price' }]
      : []),
    ...(search ? [{ label: `"${search}"`, type: 'search' }] : []),
    ...(sort
      ? [{ label: sort === 'price-asc' ? 'Price ↑' : sort === 'price-desc' ? 'Price ↓' : 'Top Rated', type: 'sort' }]
      : [])
  ];

  return (
    <div className="flex gap-8 px-8 py-8 min-h-screen">
      <FilterSidebar filters={filters} onChange={setFilters} onClear={clearAll} />

      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Search + Sort bar */}
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search t-shirts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <NativeSelect
            value={sort}
            onChange={(e) => {
              const v = e.target.value;
              trackEvent('Sort Changed', { sort: v || 'none' });
              setSort(v);
            }}
            className="w-52"
          >
            <NativeSelectOption value="">Sort by</NativeSelectOption>
            <NativeSelectOption value="price-asc">Price: Low to High</NativeSelectOption>
            <NativeSelectOption value="price-desc">Price: High to Low</NativeSelectOption>
            <NativeSelectOption value="rating">Highest Rated</NativeSelectOption>
          </NativeSelect>
          <span className="ml-auto text-sm text-muted-foreground shrink-0">
            {loading ? 'Loading…' : `Showing ${products.length} of ${total} products`}
          </span>
        </div>

        {/* Active filter badges */}
        {activeBadges.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {activeBadges.map((b) => (
              <Badge key={`${b.type}-${b.value ?? ''}`} variant="secondary" className="gap-1 capitalize pl-2 pr-1">
                {b.label}
                <button
                  onClick={() => removeFilter(b.type, b.value)}
                  className="ml-0.5 rounded-full hover:bg-muted p-0.5"
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            ))}
            <button onClick={clearAll} className="text-xs text-muted-foreground hover:underline">
              Clear all
            </button>
          </div>
        )}

        {/* Product grid */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-24">
            <Spinner className="size-8" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
            <p className="text-lg">No products found.</p>
            <Button variant="outline" onClick={clearAll}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
