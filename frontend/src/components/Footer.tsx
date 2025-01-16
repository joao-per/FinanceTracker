import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-gray-900 text-white text-center py-6 mt-8"
    >
      <motion.p
        whileHover={{ scale: 1.05 }}
        className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
      >
        © 2025 Personal Finance Tracker. Todos os direitos reservados.
      </motion.p>
    </motion.footer>
  );
};

export default Footer;
