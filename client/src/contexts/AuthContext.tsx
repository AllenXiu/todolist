import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';

// API基础URL
const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api';

// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
}

// 注册用户请求类型
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// 登录请求类型
export interface LoginRequest {
  username: string;
  password: string;
}

// 认证状态接口
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// 认证上下文接口
interface AuthContextProps {
  authState: AuthState;
  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// 认证提供者组件属性
interface AuthProviderProps {
  children: ReactNode;
}

// 认证提供者组件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
    error: null
  });

  // 设置请求头中的认证令牌
  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // 加载用户信息
  const loadUser = async () => {
    // 如果本地存储中有令牌，则设置令牌到请求头
    if (authState.token) {
      setAuthToken(authState.token);
      try {
        const res = await axios.get(`${API_URL}/auth/profile`);
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: res.data.user,
          loading: false
        }));
      } catch (err) {
        // 令牌无效或过期
        setAuthToken(null);
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false
        }));
      }
    } else {
      setAuthState(prev => ({
        ...prev,
        loading: false
      }));
    }
  };

  // 注册用户
  const register = async (data: RegisterRequest) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, data);
      setAuthToken(res.data.token);
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: res.data.user,
        token: res.data.token,
        loading: false,
        error: null
      }));
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: err.response?.data?.message || '注册失败'
      }));
      throw err;
    }
  };

  // 用户登录
  const login = async (data: LoginRequest) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, data);
      setAuthToken(res.data.token);
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: res.data.user,
        token: res.data.token,
        loading: false,
        error: null
      }));
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: err.response?.data?.message || '登录失败'
      }));
      throw err;
    }
  };

  // 退出登录
  const logout = () => {
    setAuthToken(null);
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false
    }));
  };

  // 清除错误
  const clearError = () => {
    setAuthState(prev => ({
      ...prev,
      error: null
    }));
  };

  // 组件挂载时加载用户
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{ authState, register, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

// 使用认证上下文的自定义Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
}; 