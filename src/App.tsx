import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/layout/Layout';
import { Home } from './screens/Home';
import { Results } from './screens/Results';
import { OrderSuccess } from './screens/OrderSuccess';
import { Vault } from './screens/Vault';
import { SearchProvider } from './context/SearchContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'results',
        element: <Results />,
      },
      {
        path: 'order-success',
        element: <OrderSuccess />,
      },
      {
        path: 'vault',
        element: <Vault />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </SearchProvider>
    </QueryClientProvider>
  );
}

export default App;
