import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { CheckCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { trackOrderPlaced } from '@/lib/analytics';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';
import { CheckoutProgress } from './CheckoutPage';

const SHIPPING_FLAT = 500;
const FREE_SHIPPING_THRESHOLD = 5000;

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

interface PaymentForm {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

interface PaymentErrors {
  cardholderName?: string;
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
}

function validatePayment(form: PaymentForm): PaymentErrors {
  const errors: PaymentErrors = {};
  if (!form.cardholderName.trim()) errors.cardholderName = 'Cardholder name is required.';
  const digits = form.cardNumber.replace(/\s/g, '');
  if (!digits) errors.cardNumber = 'Card number is required.';
  else if (!/^\d{16}$/.test(digits)) errors.cardNumber = 'Card number must be 16 digits.';
  if (!form.expiry.trim()) errors.expiry = 'Expiry date is required.';
  else if (!/^\d{2}\/\d{2}$/.test(form.expiry)) errors.expiry = 'Use MM/YY format.';
  if (!form.cvc.trim()) errors.cvc = 'CVC is required.';
  else if (!/^\d{3}$/.test(form.cvc)) errors.cvc = 'CVC must be 3 digits.';
  return errors;
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();

  const shipping_data = (location.state as { shipping?: Record<string, string> } | null)?.shipping;

  const [form, setForm] = useState<PaymentForm>({
    cardholderName: 'John Doe',
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/28',
    cvc: '123'
  });
  const [errors, setErrors] = useState<PaymentErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    orderId: string;
    snapshot: { items: typeof items; totalPrice: number; shipping: number; total: number };
  } | null>(null);

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = totalPrice + shipping;

  // Guards
  if (items.length === 0 && !confirmation) {
    navigate('/checkout', { replace: true });
    return null;
  }
  if (!shipping_data && !confirmation) {
    navigate('/checkout', { replace: true });
    return null;
  }

  function handleChange(field: keyof PaymentForm, raw: string) {
    let value = raw;
    if (field === 'cardNumber') value = formatCardNumber(raw);
    if (field === 'expiry') value = formatExpiry(raw);
    if (field === 'cvc') value = raw.replace(/\D/g, '').slice(0, 3);
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validatePayment(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setApiError(null);
    try {
      const digits = form.cardNumber.replace(/\s/g, '');
      const result = await api.post<{ orderId: string }>('/orders', {
        items,
        shipping: shipping_data,
        payment: {
          cardholderName: form.cardholderName,
          lastFour: digits.slice(-4)
        }
      });
      const snapshot = { items: [...items], totalPrice, shipping, total };
      // Track order placed
      trackOrderPlaced(result.orderId, total / 100, items.length);
      clearCart();
      setConfirmation({ orderId: result.orderId, snapshot });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    const { snapshot } = confirmation;
    return (
      <div className="px-8 py-8 max-w-6xl mx-auto">
        <CheckoutProgress currentStep={3} />
        <div className="max-w-lg mx-auto text-center py-10 flex flex-col items-center gap-6">
          <CheckCircleIcon className="size-16 text-green-500" />
          <div>
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground mt-2">Thank you for your purchase.</p>
            <p className="text-lg font-semibold mt-1">Order #{confirmation.orderId}</p>
          </div>

          <Card className="w-full text-left">
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {snapshot.items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="size-12 rounded-md object-cover bg-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.size} · {item.color} · qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(snapshot.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{snapshot.shipping === 0 ? 'Free' : formatPrice(snapshot.shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(snapshot.total)}</span>
              </div>
            </CardContent>
          </Card>

          {shipping_data && (
            <Card className="w-full text-left">
              <CardHeader>
                <CardTitle className="text-base">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{shipping_data.name}</p>
                <p className="text-sm text-muted-foreground">{shipping_data.address}</p>
                <p className="text-sm text-muted-foreground">
                  {shipping_data.city}, {shipping_data.state} {shipping_data.zip}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3 w-full">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/">Back to Home</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <CheckoutProgress currentStep={3} />
      <h1 className="text-2xl font-bold mb-8">Payment</h1>

      {apiError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-[1fr_360px] gap-8 items-start">
        {/* Payment form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field label="Cardholder Name" error={errors.cardholderName}>
                <Input
                  value={form.cardholderName}
                  onChange={(e) => handleChange('cardholderName', e.target.value)}
                  placeholder="John Doe"
                />
              </Field>
              <Field label="Card Number" error={errors.cardNumber}>
                <Input
                  value={form.cardNumber}
                  onChange={(e) => handleChange('cardNumber', e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  inputMode="numeric"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry Date" error={errors.expiry}>
                  <Input
                    value={form.expiry}
                    onChange={(e) => handleChange('expiry', e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    inputMode="numeric"
                  />
                </Field>
                <Field label="CVC" error={errors.cvc}>
                  <Input
                    value={form.cvc}
                    onChange={(e) => handleChange('cvc', e.target.value)}
                    placeholder="123"
                    maxLength={3}
                    inputMode="numeric"
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4" />
                Processing…
              </span>
            ) : (
              `Place Order — ${formatPrice(total)}`
            )}
          </Button>
        </form>

        {/* Order summary (read-only) */}
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                <img src={item.image} alt={item.name} className="size-14 rounded-md object-cover bg-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.size} · {item.color}
                  </p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
