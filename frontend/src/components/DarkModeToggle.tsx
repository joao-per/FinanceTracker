import React from 'react';
import '../styles/DarkModeToggle.css';

interface DarkModeToggleProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ toggleDarkMode, isDarkMode }) => {
  return (
    <div className="dark-mode-toggle">
      <label className="switch">
        <input type="checkbox" onChange={toggleDarkMode} checked={isDarkMode} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default DarkModeToggle;