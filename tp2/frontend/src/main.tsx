import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import HomePage from './views/Home.tsx';
import LoginPage from './views/Login.tsx';
import RegisterPage from './views/Register.tsx';
import RecipiePage from './views/Recipie.tsx';
import ProfilePage from './views/Profile.tsx';
import ShoppingListPage from './views/ShoppingList.tsx';
import RoutePrivate from './components/RoutePrivate.tsx';

import './index.scss'
import { RecipieProvider } from './contexts/RecipiesContext.tsx';
import { NotificationsProvider } from './contexts/NotificationsContext.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RoutePrivate><App /></RoutePrivate>,
    // errorElement: <Error404Page />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: '/recipie/:name',
        element: <RecipieProvider><RecipiePage /></RecipieProvider>
      },
      {
        path: '/profile',
        element: <ProfilePage />
      },
      {
        path: '/shoppingList',
        element: <ShoppingListPage />
      },
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
])


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <NotificationsProvider><RouterProvider router={router} /></NotificationsProvider>
)
