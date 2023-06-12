import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import HomePage from './views/Home.tsx';
import LoginPage from './views/Login.tsx';
import RegisterPage from './views/Register.tsx';
import RoutePrivate from './components/RoutePrivate.tsx';
import MobileWrap from './components/MobileWrap.tsx';

import './index.scss'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RoutePrivate><MobileWrap><App /></MobileWrap></RoutePrivate>,
    // errorElement: <Error404Page />,
    children: [
      {
        path: '',
        element: <HomePage />,
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
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
