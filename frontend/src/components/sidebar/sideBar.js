import React from 'react';
import { NavLink } from 'react-router-dom';
import './sideBar.css';

const Sidebar = ({ logout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="" alt="Logo" />
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/dashboard"
            className="menu-item"
            activeClassName="active-menu-item"
          >
            <span className="icon">🏠</span>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/transactions"
            className="menu-item"
            activeClassName="active-menu-item"
          >
            <span className="icon">💸</span>
            <span>Transaction</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/projects"
            className="menu-item"
            activeClassName="active-menu-item"
          >
            <span className="icon">📁</span>
            <span>Projects</span>
          </NavLink>
        </li>
        
        <li>
          <NavLink
            to="/settings"
            className="menu-item"
            activeClassName="active-menu-item"
          >
            <span className="icon">⚙️</span>
            <span>Settings</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            className="menu-item"
            activeClassName="active-menu-item"
            onClick={logout}
          >
            <span className="icon"> 🚪 </span>
            <span>Logout</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
