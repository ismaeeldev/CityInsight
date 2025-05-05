import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// authentication page components
const LoginPage = Loadable(lazy(() => import('views/pages/authentication/Login')));
const RegisterPage = Loadable(lazy(() => import('views/pages/authentication/Register')));
const ForgetPage = Loadable(lazy(() => import('views/pages/authentication/Forget')));
const ResetPage = Loadable(lazy(() => import('views/pages/authentication/Reset')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'admin/login',
      element: <LoginPage />
    },
    {
      path: 'admin/forget-password',
      element: <ForgetPage />
    },
    {
      path: 'admin/reset-password/:token',
      element: <ResetPage />
    },
    {
      path: 'pages/register',
      element: <RegisterPage />
    },

  ]
};

export default AuthenticationRoutes;
