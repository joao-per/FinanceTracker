import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Exemplos de Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faChartPie, faWallet, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white flex justify-between items-center p-4 shadow-md">
      <div className="flex items-center">
        <Link to="/dashboard" className="text-xl font-bold hover:text-indigo-400 transition-colors">
          <FontAwesomeIcon icon={faChartPie} className="mr-2" />
          FinanceTracker
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard"
          className="hover:text-indigo-400 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/transactions"
          className="hover:text-indigo-400 transition-colors"
        >
          <FontAwesomeIcon icon={faWallet} className="mr-1" />
          Transações
        </Link>
        <Link
          to="/budgets"
          className="hover:text-indigo-400 transition-colors"
        >
          <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-1" />
          Orçamentos
        </Link>
        <button
          onClick={handleLogout}
          className="bg-orange-500 hover:bg-orange-600 transition-colors text-white py-2 px-4 rounded flex items-center"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Sair
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
