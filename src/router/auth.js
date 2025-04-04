import { lazy } from 'react';

const authRoute = [
  {
    key: 'auth.index',
    index: true,
    path: 'login',
    Element: lazy(() => import('../pages/auth/Login')),
  },
  {
    key: 'auth.forgot',
    index: true,
    path: 'forgot',
    Element: lazy(() => import('../pages/auth/Forgot')),
  },
  {
    key: 'auth.password',
    index: true,
    path: 'reset-password',
    Element: lazy(() => import('../pages/auth/Password')),
  },
];

export default authRoute;
