import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  useTheme,
  Typography,
  ListItemButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import UploadIcon from '@mui/icons-material/Upload';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Dashboard from './components/Dashboard.tsx';
import UploadInvoice from './components/UploadInvoice.tsx';
import Income from './components/Income.tsx';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import Expenses from './components/Expense.tsx';
import Profile from './components/Profile.tsx';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <AppContent toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      </ThemeProvider>
    </AuthProvider>
  );
};

interface AppContentProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContent: React.FC<AppContentProps> = ({ isDarkMode, toggleDarkMode }) => {
  const { isAuthenticated, logout } = useAuth();
  const { i18n, t } = useTranslation();
  const theme = useTheme();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const handleLanguageChange = () => {
    const newLanguage = i18n.language === 'en' ? 'pt' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          position: 'fixed',
          left: 16,
          top: 16,
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          borderRadius: '50%',
          boxShadow: theme.shadows[2],
          '&:hover': {
            boxShadow: theme.shadows[4]
          }
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Toolbar />
        <List sx={{ flexGrow: 1 }}>
          {isAuthenticated ? (
            <>
              <ListItemButton component={Link} to="/dashboard">
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={t('dashboard')} />
              </ListItemButton>
              <ListItemButton component={Link} to="/upload">
                <ListItemIcon>
                  <UploadIcon />
                </ListItemIcon>
                <ListItemText primary={t('upload_invoices')} />
              </ListItemButton>
              <ListItemButton component={Link} to="/income">
                <ListItemIcon>
                  <UploadIcon />
                </ListItemIcon>
                <ListItemText primary={t('income')} />
              </ListItemButton>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={t('logout')} />
              </ListItemButton>
            </>
          ) : (
            <>
              <ListItemButton component={Link} to="/login">
                <ListItemText primary={t('login')} />
              </ListItemButton>
              <ListItemButton component={Link} to="/register">
                <ListItemText primary={t('register')} />
              </ListItemButton>
            </>
          )}
        </List>

        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <ListItemButton component={Link} to="/profile">
            <ListItemText primary={t('profile')} />
          </ListItemButton>
          <ListItemButton onClick={toggleDarkMode}>
            <ListItemIcon>
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </ListItemIcon>
            <ListItemText primary={isDarkMode ? t('dark_mode') : t('light_mode')} />
          </ListItemButton>
          <ListItemButton onClick={handleLanguageChange}>
            <ListItemIcon>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {i18n.language === 'en' ? 'EN' : 'PT'}
              </Typography>
            </ListItemIcon>
            <ListItemText primary={t("switch_language")} />
          </ListItemButton>
        </Box>
      </Drawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: 3,
          width: '100%',
          overflow: 'auto',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/upload"
            element={isAuthenticated ? <UploadInvoice /> : <Navigate to="/login" />}
          />
          <Route
            path="/income"
            element={isAuthenticated ? <Income /> : <Navigate to="/login" />}
          />
          <Route
            path="/expenses"
            element={isAuthenticated ? <Expenses /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;