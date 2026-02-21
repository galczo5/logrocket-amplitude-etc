import { Router } from 'express';
import { products } from '../data/products.js';
import type { Product } from '../data/products.js';

const router = Router();

// GET /api/products
router.get('/', (req, res) => {
  const { category, size, color, minPrice, maxPrice, sort, search } = req.query;

  let result: Product[] = [...products];

  if (typeof category === 'string' && category) {
    result = result.filter((p) => p.category === category);
  }

  if (typeof size === 'string' && size) {
    result = result.filter((p) => p.sizes.includes(size));
  }

  if (typeof color === 'string' && color) {
    const colorLower = color.toLowerCase();
    result = result.filter((p) => p.colors.some((c) => c.name.toLowerCase().includes(colorLower)));
  }

  if (typeof minPrice === 'string' && minPrice) {
    const min = parseInt(minPrice, 10);
    if (!isNaN(min)) result = result.filter((p) => p.price >= min);
  }

  if (typeof maxPrice === 'string' && maxPrice) {
    const max = parseInt(maxPrice, 10);
    if (!isNaN(max)) result = result.filter((p) => p.price <= max);
  }

  if (typeof search === 'string' && search) {
    const term = search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
  }

  if (typeof sort === 'string') {
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }
  }

  res.json({ products: result, total: result.length });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

export default router;
