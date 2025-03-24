import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const PrivateRoute: React.FC = () => {
  const { authState } = useAuth();
  const location = useLocation();

  // 如果正在加载认证状态，显示加载指示器
  if (authState.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 如果未认证，重定向到登录页面
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 已认证，渲染子路由
  return <Outlet />;
};

export default PrivateRoute; 