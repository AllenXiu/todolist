export interface User {
  id: string;
  username: string;
  password: string; // 存储的是密码哈希，不是明文密码
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  username: string;
  password: string;
  email: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
} 