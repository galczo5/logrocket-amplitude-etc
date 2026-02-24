import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function LoginPage() {
  const { login, devLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [devLoadingId, setDevLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError('Both fields are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDevLogin(userId: string) {
    setError('');
    setDevLoadingId(userId);
    try {
      await devLogin(userId);
      navigate(from, { replace: true });
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setDevLoadingId(null);
    }
  }

  const devUsers = [
    { id: 'user-1', label: 'John Doe' },
    { id: 'user-2', label: 'Not John Doe' }
  ];

  return (
    <div className="flex items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Sign In</CardTitle>
          <CardDescription>Enter any email and password to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Spinner className="mr-2" />}
              Sign In
            </Button>
          </form>

          <div className="mt-6 border-t pt-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Developer Mode</p>
            <div className="flex gap-2">
              {devUsers.map(({ id, label }) => (
                <Button
                  key={id}
                  variant="outline"
                  className="flex-1"
                  disabled={devLoadingId !== null || loading}
                  onClick={() => handleDevLogin(id)}
                >
                  {devLoadingId === id && <Spinner className="mr-2" />}
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
