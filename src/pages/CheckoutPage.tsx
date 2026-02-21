import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { useCart } from "@/context/CartContext";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const SHIPPING_FLAT = 500; // cents
const FREE_SHIPPING_THRESHOLD = 5000; // cents

interface ShippingForm {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function validate(form: ShippingForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Full name is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address.";
  if (!form.address.trim()) errors.address = "Address is required.";
  if (!form.city.trim()) errors.city = "City is required.";
  if (!form.state) errors.state = "State is required.";
  if (!form.zip.trim()) errors.zip = "ZIP code is required.";
  else if (!/^\d{5}$/.test(form.zip)) errors.zip = "ZIP code must be 5 digits.";
  return errors;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  const [form, setForm] = useState<ShippingForm>({
    name: "John Doe",
    email: "john.doe@example.com",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = totalPrice + shipping;

  function handleChange(field: keyof ShippingForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    navigate("/checkout/payment", { state: { shipping: form } });
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
        <p className="text-xl font-medium">Your cart is empty.</p>
        <Button asChild variant="outline">
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <CheckoutProgress currentStep={2} />
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-[1fr_360px] gap-8 items-start">
        {/* Shipping form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field label="Full Name" error={errors.name}>
                <Input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="John Doe"
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Address" error={errors.address}>
                <Input
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="123 Main St"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="City" error={errors.city}>
                  <Input
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="New York"
                  />
                </Field>
                <Field label="ZIP Code" error={errors.zip}>
                  <Input
                    value={form.zip}
                    onChange={(e) => handleChange("zip", e.target.value)}
                    placeholder="10001"
                    maxLength={5}
                  />
                </Field>
              </div>
              <Field label="State" error={errors.state}>
                <NativeSelect
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="w-full"
                >
                  <NativeSelectOption value="">Select state…</NativeSelectOption>
                  {US_STATES.map((s) => (
                    <NativeSelectOption key={s} value={s}>{s}</NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full">
            Proceed to Payment
          </Button>
        </form>

        {/* Order summary */}
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-16 rounded-md object-cover bg-muted shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.size} · {item.color}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      className="size-5 rounded border flex items-center justify-center hover:bg-muted"
                    >
                      <MinusIcon className="size-3" />
                    </button>
                    <span className="text-sm w-5 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="size-5 rounded border flex items-center justify-center hover:bg-muted"
                    >
                      <PlusIcon className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="ml-auto text-muted-foreground hover:text-destructive"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                </div>
                <span className="text-sm font-medium shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted-foreground">
                Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </p>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function CheckoutProgress({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Cart Review" },
    { n: 2, label: "Shipping" },
    { n: 3, label: "Payment" },
  ];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={step.n} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`size-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
                step.n < currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : step.n === currentStep
                  ? "border-primary text-primary"
                  : "border-muted-foreground/30 text-muted-foreground/50"
              }`}
            >
              {step.n < currentStep ? "✓" : step.n}
            </div>
            <span
              className={`text-sm ${
                step.n === currentStep
                  ? "font-semibold text-foreground"
                  : step.n < currentStep
                  ? "text-muted-foreground"
                  : "text-muted-foreground/50"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-8 ${
                step.n < currentStep ? "bg-primary" : "bg-muted-foreground/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
