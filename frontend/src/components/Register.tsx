import React, { useState } from 'react';
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
  Link as MuiLink,
  Alert,
  Collapse,
  IconButton,
  CircularProgress
} from '@mui/material';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LoginIcon from '@mui/icons-material/Login';
import { useTheme } from '@mui/material/styles';

const Register: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t('error_register'));
      }
      
      setSuccess(t('account_created'));
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || t('error_register'));
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
        minHeight: '80vh',
        overflow: 'auto',
        backgroundColor: theme.palette.background.default,
        py: 2
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
          justifyContent: 'flex-start',
          minHeight: 0,
          py: 2
        }}
      >
        <Box
          sx={{
            width: '100%',
            textAlign: 'center',
            mb: 2
          }}
        >
          <Avatar 
            sx={{ 
              mb: 2,
              bgcolor: 'secondary.main',
              width: 48,
              height: 48,
              color: theme.palette.getContrastText(theme.palette.secondary.main),
              mx: 'auto'
            }}
          >
            <HowToRegOutlinedIcon fontSize="medium" />
          </Avatar>
          
          <Typography 
                      variant="h5" 
                      component="h1"
                      sx={{ 
                        fontWeight: 500,
                        letterSpacing: 0.5,
                        color: theme.palette.text.primary
                      }}
                    >
            {t('register')}
          </Typography>
        </Box>

        <Box sx={{ 
          width: '100%',
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'auto'
        }}>
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

          <Collapse in={!!success}>
            <Alert
              severity="success"
              sx={{ 
                mb: 2,
                borderRadius: 1,
                border: `1px solid ${theme.palette.success.light}`
              }}
            >
              {success}
            </Alert>
          </Collapse>

          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              width: '100%',
              '& .MuiTextField-root': {
                my: 0.5
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
              sx={{
                mt: 1,
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />

            <TextField
              fullWidth
              required
              type="email"
              label={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mt: 1,
                mb: 1,
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
              sx={{
                mt: 1,
                mb: 1,
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
                mt: 1.5,
                py: 1,
                borderRadius: 1,
                fontWeight: 500,
                textTransform: 'none',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[3]
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  {t('register_now')}
                  <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                </>
              )}
            </Button>

            <Box sx={{ 
              mt: 1.5,
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }}>
              <MuiLink 
                component={Link} 
                to="/login" 
                variant="body2" 
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.primary.main
                  }
                }}
              >
                <LoginIcon fontSize="small" />
                {t('have_account')}
              </MuiLink>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;