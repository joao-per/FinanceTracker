import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Dashboard from './components/Dashboard.tsx';
import UploadInvoice from './components/UploadInvoice.tsx';
import Income from './components/Income.tsx';
import Header from './components/Header.tsx';
import { useDarkMode } from './hooks/useDarkMode.tsx';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';


const App: React.FC = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  return (
    <AuthProvider>
      <AppContent isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </AuthProvider>
  );
};

interface AppContentProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContent: React.FC<AppContentProps> = ({ isDarkMode, toggleDarkMode }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={isDarkMode ? 'app dark' : 'app'}>
      <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <main>
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
            element={isAuthenticated ? <Income /> : <Navigate to="/login"/>}
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
