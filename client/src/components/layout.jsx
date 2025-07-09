import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

const Layout = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <Outlet /> {/* Yahan aapke page ka content (Dashboard, etc.) render hoga */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;