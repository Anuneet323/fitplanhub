import React from 'react';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
