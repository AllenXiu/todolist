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
import { useAuth, RegisterRequest } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest & { confirmPassword: string }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, authState, clearError } = useAuth();
  const navigate = useNavigate();

  const { username, email, password, confirmPassword } = formData;

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

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 基本表单验证
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('请填写所有必填字段');
      return;
    }
    
    // 验证邮箱格式
    if (!validateEmail(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }
    
    // 验证密码长度
    if (password.length < 6) {
      setError('密码长度必须至少为6个字符');
      return;
    }
    
    // 验证两次密码是否一致
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    setLoading(true);
    
    try {
      // 只传递需要的字段
      const registerData: RegisterRequest = {
        username,
        email,
        password
      };
      
      await register(registerData);
      navigate('/'); // 注册成功后重定向到首页
    } catch (err: any) {
      setError(err.response?.data?.message || '注册失败，请重试');
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
            用户注册
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
              id="email"
              label="邮箱地址"
              name="email"
              autoComplete="email"
              type="email"
              value={email}
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
              autoComplete="new-password"
              value={password}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="确认密码"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
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
              {loading ? <CircularProgress size={24} /> : '注册'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  {"已有账号？点击登录"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 