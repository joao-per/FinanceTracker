import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Avatar,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Box,
  Grid,
  Link as MuiLink,
  Alert,
  Collapse,
  IconButton,
  Fade,
  useTheme,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  LockOutlined,
  AccountBalanceWalletOutlined,
  PersonOutline,
  KeyOutlined,
  ArrowForward
} from '@mui/icons-material';

const Login: React.FC = () => {
  const theme = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        throw new Error(t('invalid_credentials'));
      }
      
      const data = await response.json();
      login(data.access);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || t('invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop:"150px",
      paddingBottom:"150px",
      marginBottom:"150px",
      scrollBehavior: 'unset',
     
      backgroundColor: theme.palette.background.default,
    }}
    >
      <CssBaseline />
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          py: 4
        }}
      >
        <Box
          sx={{
            width: '100%',
            textAlign: 'center',
            mb: 4
          }}
        >
          <AccountBalanceWalletOutlined 
            sx={{ 
              fontSize: 48,
              color: theme.palette.mode === 'dark' ? 
                theme.palette.primary.light : 
                theme.palette.primary.dark,
              mb: 2
            }}
          />
          <Typography 
            variant="h5" 
            component="h1"
            sx={{ 
              fontWeight: 500,
              letterSpacing: 0.5,
              color: theme.palette.text.primary
            }}
          >
            {t('welcome_back')}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {t('login_to_manage')}
          </Typography>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Collapse in={!!error}>
            <Alert
              severity="error"
              sx={{ 
                mb: 2,
                borderRadius: 1,
                border: `1px solid ${theme.palette.error.light}`
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          </Collapse>

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              width: '100%',
              '& .MuiTextField-root': {
                my: 1
              }
            }}
          >
            <TextField
              fullWidth
              required
              variant="outlined"
              label={t('username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline 
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />

            <TextField
              fullWidth
              required
              type="password"
              label={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyOutlined 
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 1,
                fontWeight: 500,
                textTransform: 'none',
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 0.9
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  {t('sign_in')}
                  <ArrowForward sx={{ ml: 1, fontSize: 18 }} />
                </>
              )}
            </Button>

            <Grid container sx={{ mt: 2, justifyContent: 'space-between' }}>
              <Grid item>
                <MuiLink 
                  component={Link} 
                  to="/register" 
                  variant="body2" 
                  sx={{
                    textDecoration: 'none',
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  {t('create_account')}
                </MuiLink>
              </Grid>
              <Grid item>
                <MuiLink 
                  component={Link} 
                  to="/forgot-password" 
                  variant="body2" 
                  sx={{
                    textDecoration: 'none',
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  {t('forgot_password')}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;