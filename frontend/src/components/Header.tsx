// src/components/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import DarkModeToggle from './DarkModeToggle.tsx';
import '../styles/Header.css';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, isDarkMode }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/dashboard">{t('personal_finance_tracker')}</Link>
      </div>
      <nav>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">{t('dashboard')}</Link>
            <Link to="/upload">{t('upload_invoices')}</Link>
            <button onClick={handleLogout}>{t('logout')}</button>
          </>
        ) : (
          <>
            <Link to="/login">{t('login')}</Link>
            <Link to="/register">{t('register')}</Link>
          </>
        )}
      </nav>
      <div className="header-controls">
        <select onChange={handleLanguageChange} value={i18n.language}>
          <option value="pt">PT</option>
          <option value="en">EN</option>
        </select>
        <DarkModeToggle toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      </div>
    </header>
  );
};

export default Header;