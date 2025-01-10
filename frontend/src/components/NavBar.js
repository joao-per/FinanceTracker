import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#eee' }}>
      <Link to="/dashboard" style={{ marginRight: '10px' }}>Dashboard</Link>
      <Link to="/transactions" style={{ marginRight: '10px' }}>Transações</Link>
      <Link to="/">Sair</Link>
    </nav>
  );
}

export default NavBar;
