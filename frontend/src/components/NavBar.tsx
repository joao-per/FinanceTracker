import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt,
  faChartPie,
  faWallet,
  faFileInvoiceDollar,
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-gray-800 text-white flex justify-between items-center p-4 shadow-md"
    >
      <div className="flex items-center">
        <Link
          to="/dashboard"
          className="text-xl font-bold hover:text-indigo-400 transition-colors"
        >
          <FontAwesomeIcon icon={faChartPie} className="mr-2" />
          FinanceTracker
        </Link>
      </div>
      <div className="flex items-center space-x-6">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/dashboard"
            className="hover:text-indigo-400 transition-colors"
          >
            Dashboard
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/transactions"
            className="hover:text-indigo-400 transition-colors"
          >
            <FontAwesomeIcon icon={faWallet} className="mr-1" />
            Transações
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/budgets"
            className="hover:text-indigo-400 transition-colors"
          >
            <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-1" />
            Orçamentos
          </Link>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: '#FF8C00' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="bg-orange-500 hover:bg-orange-600 transition-colors text-white py-2 px-4 rounded flex items-center"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Sair
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default NavBar;
