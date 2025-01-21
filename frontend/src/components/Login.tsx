// src/components/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';
import { useTranslation } from 'react-i18next';


const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form animate-form" onSubmit={handleSubmit}>
        <h2>{t('login')}</h2>
        {error && <p className="error">{error}</p>}
        <label>
          {t('username')}:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          {t('password')}:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn">{t('enter')}</button>
        <p>
          {t('no_account')} <Link to="/register">{t('register')}</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;