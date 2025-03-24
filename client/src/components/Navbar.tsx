import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };
  
  const menuId = 'primary-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>个人信息</MenuItem>
      <MenuItem onClick={handleLogout}>退出登录</MenuItem>
    </Menu>
  );
  
  const mobileMenuId = 'primary-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      id={mobileMenuId}
      keepMounted
      open={isMobileMenuOpen}
      onClose={handleMenuClose}
    >
      {authState.isAuthenticated ? (
        [
          <MenuItem key="profile" onClick={handleMenuClose}>个人信息</MenuItem>,
          <MenuItem key="logout" onClick={handleLogout}>退出登录</MenuItem>
        ]
      ) : (
        [
          <MenuItem key="login" onClick={() => { handleMenuClose(); navigate('/login'); }}>
            登录
          </MenuItem>,
          <MenuItem key="register" onClick={() => { handleMenuClose(); navigate('/register'); }}>
            注册
          </MenuItem>
        ]
      )}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            待办事项管理
          </Typography>
          
          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              {renderMobileMenu}
            </>
          ) : (
            <>
              {authState.isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    欢迎，{authState.user?.username}
                  </Typography>
                  <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="account"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                  >
                    <AccountCircle />
                  </IconButton>
                </Box>
              ) : (
                <Box>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/login"
                    sx={{ mr: 1 }}
                  >
                    登录
                  </Button>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/register"
                  >
                    注册
                  </Button>
                </Box>
              )}
              {renderMenu}
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar; 