import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AppLayout } from '@/components/layout/app-layout';
import Dashboard from '@/pages/dashboard';
import ProductsList from '@/pages/products';
import LoginPage from '@/pages/login';
import { AuthProvider, useAuth } from '@/context/auth-context';

const ProductDetail = lazy(() => import('@/pages/product-detail'));

function PageLoader() {
  return (
    <div className="w-full h-full min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-r-transparent animate-spin" />
        <div className="text-sm text-muted-foreground font-medium">Loading details...</div>
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

function Router() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <LoginPage />;
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/products" component={ProductsList} />
        <Route path="/products/:id">
          {() => (
            <Suspense fallback={<PageLoader />}>
              <ProductDetail />
            </Suspense>
          )}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base="/">
          <Router />
          <Toaster />
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
