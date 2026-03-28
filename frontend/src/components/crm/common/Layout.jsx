import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="layout-wrapper">
      <aside className="sidebar-aside">
        <Sidebar />
      </aside>

      <main className="main-content">
        <Header /> {/* On a ajouté le Header ici */}
        <div className="animate-page">
          {children}
        </div>
      </main>
    </div>
  );
}