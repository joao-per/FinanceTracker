import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button,
  Select,
  MenuItem,
  IconButton,
  useTheme,
  SelectChangeEvent,
  Tooltip
} from '@mui/material';
import { useAuth } from '../hooks/useAuth.tsx';
import { useTranslation } from 'react-i18next';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

interface HeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, isDarkMode }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLanguageChange = (e: SelectChangeEvent) => {
    i18n.changeLanguage(e.target.value as string);
  };

  return (
    <AppBar position="static" sx={{ 
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/dashboard" 
          sx={{ 
            textDecoration: 'none', 
            color: 'inherit',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          {t('personal_finance_tracker')}
        </Typography>

        {isAuthenticated && (
          <div style={{ display: 'flex', gap: '20px' }}>
            <Button 
              component={Link} 
              to="/dashboard" 
              color="inherit"
              sx={{ textTransform: 'none' }}
            >
              {t('dashboard')}
            </Button>
            <Button 
              component={Link} 
              to="/upload" 
              color="inherit"
              sx={{ textTransform: 'none' }}
            >
              {t('upload_invoices')}
            </Button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            variant="outlined"
            size="small"
            sx={{ 
              color: 'inherit',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.23)'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)'
              }
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: theme.palette.mode === 'dark' ? '#121212' : '#fff',
                }
              }
            }}
          >
            <MenuItem value="pt">PT</MenuItem>
            <MenuItem value="en">EN</MenuItem>
          </Select>

          <Tooltip title={t('toggle_theme')}>
          <IconButton onClick={toggleDarkMode} color="inherit">
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
          </Tooltip>

          {isAuthenticated && (
            <Tooltip title={t('logout')}>
              <IconButton onClick={handleLogout} color="inherit">
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;