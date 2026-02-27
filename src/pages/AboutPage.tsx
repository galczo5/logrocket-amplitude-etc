import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { trackEvent } from '@/lib/analytics';

const TECH_STACK = [
  { layer: 'Frontend', tech: 'React 19 + TypeScript + Vite' },
  { layer: 'Styling', tech: 'Tailwind CSS v4 + shadcn/ui' },
  { layer: 'Routing', tech: 'React Router v7' },
  { layer: 'Backend', tech: 'Express 5 (in-memory data)' }
];

const DEMONSTRATES = [
  {
    term: 'Session replay',
    detail: 'Record and replay user sessions to understand real behavior (e.g. LogRocket)'
  },
  {
    term: 'Event tracking',
    detail: 'Capture user interactions and build funnels (e.g. Amplitude)'
  },
  {
    term: 'User identification',
    detail: 'Associate analytics events with logged-in users'
  },
  {
    term: 'Conversion analytics',
    detail: 'Measure drop-off across the checkout funnel'
  }
];

const NOTES = [
  'All product data is mocked — no real inventory exists',
  'Login accepts any email and password (no real authentication)',
  'No real payments are processed',
  'Data resets on every server restart'
];

export default function AboutPage() {
  useEffect(() => {
    trackEvent('Navigated to About', { route: '/about' });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-8 py-12 flex flex-col gap-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">About This App</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          This is a demo e-commerce application built to showcase user monitoring and analytics integrations. It
          simulates a real t-shirt shop — with product listings, a cart, checkout, and user authentication — but all
          data is mocked and no real transactions take place.
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>What This App Demonstrates</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {DEMONSTRATES.map(({ term, detail }) => (
              <li key={term} className="flex gap-2">
                <span className="font-semibold shrink-0">{term}</span>
                <span className="text-muted-foreground">— {detail}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tech Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-8 font-semibold text-muted-foreground">Layer</th>
                <th className="text-left py-2 font-semibold text-muted-foreground">Technology</th>
              </tr>
            </thead>
            <tbody>
              {TECH_STACK.map(({ layer, tech }) => (
                <tr key={layer} className="border-b last:border-0">
                  <td className="py-2 pr-8 font-medium">{layer}</td>
                  <td className="py-2 text-muted-foreground">{tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {NOTES.map((note) => (
              <li key={note} className="flex gap-2 text-muted-foreground">
                <span className="mt-1.5 size-1.5 rounded-full bg-muted-foreground shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
