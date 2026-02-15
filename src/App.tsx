import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './screens/Home';
import { Results } from './screens/Results';
import { Profile } from './screens/Profile';
import { OrderSuccess } from './screens/OrderSuccess';
import { History } from './screens/History';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext';
import { Inbox } from './screens/Inbox';
import { Login } from './screens/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
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
        path: 'inbox',
        element: (
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'order-success',
        element: <OrderSuccess />,
      },
      {
        path: 'history',
        element: (
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <RouterProvider router={router} />
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
