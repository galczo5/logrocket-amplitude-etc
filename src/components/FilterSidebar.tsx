import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

const CATEGORIES = ['men', 'women', 'unisex'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#9CA3AF' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Olive', hex: '#6B7C32' },
  { name: 'Orange', hex: '#F97316' }
];

export interface FilterValues {
  categories: string[];
  sizes: string[];
  colors: string[];
  minPrice: string;
  maxPrice: string;
}

interface Props {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  onClear: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        className="flex w-full items-center justify-between py-2 text-sm font-semibold"
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        {open ? (
          <ChevronUpIcon className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        )}
      </button>
      {open && <div className="pb-2 flex flex-col gap-2">{children}</div>}
    </div>
  );
}

function toggleItem(arr: string[], val: string) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

export default function FilterSidebar({ filters, onChange, onClear }: Props) {
  return (
    <aside className="w-56 shrink-0 flex flex-col gap-1">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-sm">Filters</span>
        <Button variant="ghost" size="xs" onClick={onClear}>
          Clear All
        </Button>
      </div>

      <Separator />

      <Section title="Category">
        {CATEGORIES.map((cat) => (
          <div key={cat} className="flex items-center gap-2">
            <Checkbox
              id={`cat-${cat}`}
              checked={filters.categories.includes(cat)}
              onCheckedChange={() =>
                onChange({
                  ...filters,
                  categories: toggleItem(filters.categories, cat)
                })
              }
            />
            <Label htmlFor={`cat-${cat}`} className="capitalize font-normal cursor-pointer">
              {cat}
            </Label>
          </div>
        ))}
      </Section>

      <Separator />

      <Section title="Size">
        {SIZES.map((size) => (
          <div key={size} className="flex items-center gap-2">
            <Checkbox
              id={`size-${size}`}
              checked={filters.sizes.includes(size)}
              onCheckedChange={() => onChange({ ...filters, sizes: toggleItem(filters.sizes, size) })}
            />
            <Label htmlFor={`size-${size}`} className="font-normal cursor-pointer">
              {size}
            </Label>
          </div>
        ))}
      </Section>

      <Separator />

      <Section title="Color">
        {COLORS.map((color) => (
          <div key={color.name} className="flex items-center gap-2">
            <Checkbox
              id={`color-${color.name}`}
              checked={filters.colors.includes(color.name)}
              onCheckedChange={() =>
                onChange({
                  ...filters,
                  colors: toggleItem(filters.colors, color.name)
                })
              }
            />
            <span
              className="size-4 rounded-full border border-border shrink-0"
              style={{ backgroundColor: color.hex }}
            />
            <Label htmlFor={`color-${color.name}`} className="font-normal cursor-pointer">
              {color.name}
            </Label>
          </div>
        ))}
      </Section>

      <Separator />

      <Section title="Price (cents)">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="h-8 text-sm"
          />
          <span className="text-muted-foreground text-sm">–</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
      </Section>
    </aside>
  );
}
