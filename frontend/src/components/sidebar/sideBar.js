import React from 'react';
import { Link } from 'react-router-dom';
import './sideBar.css';

const Sidebar = ({ logout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="" alt="Logo" />
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard" className="menu-item">
            <span className="icon">🏠</span>
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/transactions" className="menu-item">
            <span className="icon">💸</span>
            <span>Transaction</span>
          </Link>
        </li>
        <li>
          <Link to="/projects" className="menu-item">
            <span className="icon">📁</span>
            <span>Projects</span>
          </Link>
        </li>
        <li>
          <Link to="/budget" className="menu-item">
            <span className="icon">💰</span>
            <span>Budget/Solde</span>
          </Link>
        </li>
        <li>
          <Link to="/settings" className="menu-item">
            <span className="icon">⚙️</span>
            <span>Settings</span>
          </Link>
        </li>
        <li><button onClick={logout}>Logout</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
