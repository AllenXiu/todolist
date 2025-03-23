import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Container, AppBar, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { zhCN } from '@mui/material/locale';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import zhCNLocale from 'date-fns/locale/zh-CN';

import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import TodoDetail from './components/TodoDetail';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCNLocale}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" sx={{ mb: 2 }}>
              <Toolbar>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  component="div" 
                  sx={{ flexGrow: 1 }}
                >
                  待办事项管理
                </Typography>
              </Toolbar>
            </AppBar>
            
            <Box sx={{ flexGrow: 1, py: 2 }}>
              <Routes>
                <Route path="/" element={<TodoList />} />
                <Route path="/create" element={<TodoForm mode="create" />} />
                <Route path="/edit/:id" element={<TodoForm mode="edit" />} />
                <Route path="/view/:id" element={<TodoDetail />} />
              </Routes>
            </Box>
            
            <Box component="footer" sx={{ 
              py: 3, 
              mt: 'auto',
              backgroundColor: (theme) => theme.palette.grey[100],
              textAlign: 'center'
            }}>
              <Container maxWidth="md">
                <Typography variant="body2" color="textSecondary">
                  © {new Date().getFullYear()} 待办事项管理系统
                </Typography>
              </Container>
            </Box>
          </Box>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
