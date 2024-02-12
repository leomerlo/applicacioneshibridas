import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import { initMercadoPago } from '@mercadopago/sdk-react';
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
import { AdminProvider } from './contexts/AdminContext.tsx';
import AddPatient from './views/AddPatient.tsx';
import AddPlan from './views/AddPlan.tsx';
import RoutePrivateDoctor from './components/RoutePrivateDoctor.tsx';
import NoPermissions from './views/NoPermissions.tsx';
import Patient from './views/Patient.tsx';
import AssignPlan from './views/AssignPlan.tsx';
import Plans from './views/Plans.tsx';
import PlanView from './views/Plan.tsx';
import ForgotPassword from './views/ForgotPassword.tsx';
import BackOffice from './views/backoffice/BackOffice.tsx';
import Dashboard from './views/backoffice/Dashboard.tsx';
import RouteAdmin from './components/RouteAdmin.tsx';
import Users from './views/backoffice/Users.tsx';
import AddUserPage from './views/backoffice/AddUserPage.tsx';
import UserView from './views/backoffice/UserView.tsx';
import LandingPage from './views/LandingPage.tsx';
import Subscription from './views/Subscription.tsx';

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
      {
        path: '/plans',
        element: <Plans />
      },
      {
        path: '/plan/',
        element: <PlanView />
      },
      {
        path: '/plan/:id',
        element: <PlanView />
      },
      {
        path: '/addPatient',
        element: <RoutePrivateDoctor><AddPatient /></RoutePrivateDoctor>
      },
      {
        path: '/addPlan',
        element: <RoutePrivateDoctor><AddPlan /></RoutePrivateDoctor>
      },
      {
        path: '/patient/:id',
        element: <RoutePrivateDoctor><Patient /></RoutePrivateDoctor>
      },
      {
        path: '/patient/:id/assignPlan',
        element: <RoutePrivateDoctor><AssignPlan /></RoutePrivateDoctor>
      },
      {
        path: '/notAllowed',
        element: <NoPermissions />
      },
      {
        path: '/recipie/:profileId/:name',
        element: <RecipieProvider><RecipiePage /></RecipieProvider>
      },
    ]
  },
  {
    path: '/admin',
    element: <RoutePrivate><AdminProvider><BackOffice /></AdminProvider></RoutePrivate>,
    // errorElement: <Error404Page />,
    children: [
      {
        path: '',
        element: <RouteAdmin><Dashboard /></RouteAdmin>,
      },
      {
        path: '/admin/users',
        element: <RouteAdmin><Users /></RouteAdmin>,
      },
      {
        path: '/admin/addUser',
        element: <RouteAdmin><AddUserPage /></RouteAdmin>,
      },
      {
        path: '/admin/user/:id',
        element: <RouteAdmin><UserView /></RouteAdmin>,
      }
    ]
  },
  {
    path: '/subscription',
    element: <Subscription />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/forgotPassword',
    element: <ForgotPassword />
  },
  {
    path: '/register/:type',
    element: <RegisterPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/landing',
    element: <LandingPage />
  },
]);

initMercadoPago('TEST-46c82482-296a-4e30-8409-01d07c7f5de4');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <NotificationsProvider><RouterProvider router={router} /></NotificationsProvider>
)
