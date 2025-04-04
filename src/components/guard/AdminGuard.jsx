/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminGaurd = ({ children }) => {
  const { token, userType } = useSelector((state) => state.auth);

  const isAuthenticated = Boolean(token && userType === 2);

  return isAuthenticated ? children : <Navigate to={'/auth/login'} replace={true} />;
};

export default AdminGaurd;
