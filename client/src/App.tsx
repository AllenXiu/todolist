import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Container } from '@mui/material';
import { zhCN } from '@mui/material/locale';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import zhCNLocale from 'date-fns/locale/zh-CN';

import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import TodoDetail from './components/TodoDetail';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

// 创建响应式主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
}, zhCN);

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCNLocale}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              
              <Box sx={{ flexGrow: 1, py: 2 }}>
                <Routes>
                  {/* 公共路由 */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* 受保护的路由 */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/" element={<TodoList />} />
                    <Route path="/create" element={<TodoForm mode="create" />} />
                    <Route path="/edit/:id" element={<TodoForm mode="edit" />} />
                    <Route path="/view/:id" element={<TodoDetail />} />
                  </Route>
                  
                  {/* 重定向任何未匹配的路由到首页 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
              
              <Box component="footer" sx={{ 
                py: 3, 
                mt: 'auto',
                backgroundColor: (theme) => theme.palette.grey[100],
                textAlign: 'center'
              }}>
                <Container maxWidth="md">
                  <Box sx={{ my: 1 }}>
                    © {new Date().getFullYear()} 待办事项管理系统
                  </Box>
                </Container>
              </Box>
            </Box>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
