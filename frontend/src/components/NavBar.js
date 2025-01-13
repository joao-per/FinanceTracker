import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/dashboard" className="logo">FinanceTracker</Link>
      </div>
      <div className="nav-right">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transações</Link>
        <Link to="/budgets">Orçamentos</Link>
        <button onClick={handleLogout} className="logout-btn">Sair</button>
      </div>
    </nav>
  );
}

export default NavBar;
