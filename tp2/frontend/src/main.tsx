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
import AddPatient from './views/AddPatient.tsx';
import AddPlan from './views/AddPlan.tsx';
import RoutePrivateDoctor from './components/RoutePrivateDoctor.tsx';
import NoPermissions from './views/NoPermissions.tsx';
import Patient from './views/Patient.tsx';
import AssignPlan from './views/AssignPlan.tsx';
import Plans from './views/Plans.tsx';
import PlanView from './views/Plan.tsx';
import ForgotPassword from './views/ForgotPassword.tsx';
import PasswordReset from './views/PasswordReset.tsx';

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
])


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <NotificationsProvider><RouterProvider router={router} /></NotificationsProvider>
)
