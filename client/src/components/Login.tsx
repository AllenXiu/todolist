import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box, 
  Grid, 
  Link, 
  Paper, 
  Alert,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth, LoginRequest } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, authState, clearError } = useAuth();
  const navigate = useNavigate();

  const { username, password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除错误提示
    if (error) {
      setError(null);
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 基本表单验证
    if (!username.trim() || !password.trim()) {
      setError('请填写所有必填字段');
      return;
    }
    
    setLoading(true);
    
    try {
      await login(formData);
      navigate('/'); // 登录成功后重定向到首页
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            用户登录
          </Typography>
          
          {(error || authState.error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || authState.error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="用户名"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handleChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : '登录'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  {"还没有账号？点击注册"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 