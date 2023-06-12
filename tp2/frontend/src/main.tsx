import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import HomePage from './views/Home.tsx';
import LoginPage from './views/Login.tsx';
import RoutePrivate from './components/RoutePrivate.tsx';
import './index.css'

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
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
  
])


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
