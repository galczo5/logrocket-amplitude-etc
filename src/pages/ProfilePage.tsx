import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  status: 'confirmed' | 'pending';
  createdAt: string;
  items: OrderItem[];
  shipping: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
  total: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/profile' }, replace: true });
      return;
    }
    api
      .get<{ orders: Order[] }>('/orders')
      .then(({ orders }) => setOrders(orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  function handleSignOut() {
    logout();
    navigate('/');
  }

  if (!isAuthenticated) return null;

  const initials = user?.name.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="max-w-5xl mx-auto px-8 py-12 flex gap-8">
      {/* Left: user info */}
      <div className="w-64 shrink-0">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="size-20 rounded-full object-cover" />
            ) : (
              <div className="size-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-semibold">
                {initials}
              </div>
            )}
            <div className="text-center">
              <p className="text-lg font-semibold">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-1">ID: {user?.id}</p>
            </div>
            <Button variant="outline" className="w-full mt-2" onClick={handleSignOut}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right: order history */}
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Order History</h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-muted-foreground">
            <p>No orders yet.</p>
            <Button asChild variant="secondary">
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Order #{order.id}</CardTitle>
                  <Badge variant={order.status === 'confirmed' ? 'default' : 'secondary'}>{order.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Placed on: {formatDate(order.createdAt)}</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Separator />
                <div className="flex flex-col gap-1">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
