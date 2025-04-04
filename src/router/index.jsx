import { ToastContainer } from 'react-toastify';
import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import adminRoutes from './admin';
import authRoute from './auth';
import { useSelector } from 'react-redux';
const Layout = lazy(() => import('../layout/Layout'));
const AuthLayout = lazy(() => import('../layout/authLayout'));

const Router = () => {
  const { token } = useSelector((state) => state.auth);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to={token ? '/dashboard' : '/auth/login'} replace={true}/>} />
        <Route path="/auth" element={<AuthLayout />}>
          {authRoute.map(({ Element, index, key, path }) => (
            <Route index={index} path={path} element={<Element />} key={key} />
          ))}
        </Route>
        <Route path="/*" element={<Layout />}>
          {adminRoutes.map(({ Element, index, key, path }) => (
            <Route index={index} path={path} element={<Element />} key={key} />
          ))}
        </Route>
      </Routes>
    </>
  );
};

export default Router;
