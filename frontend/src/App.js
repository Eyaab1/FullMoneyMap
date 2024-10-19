import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/sidebar/sideBar';
import Dashboard from './components/dashboard/dashboard';
import ProjectList from './components/projectlist/projectList';
import SelectedProject from './components/projectlist/selectedProject';
import Login from './components/login/login';
import AddProject from './components/projectlist/addProject';
import TransactionHistory from './components/transactionHistory/transactionHistory';
import AddTransaction from './components/addTransaction/addTransaction';
import './App.css';

const App = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  // Function to handle login using the backend API
  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/utilisateurs/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true); // Update authentication status here
        localStorage.setItem('user', JSON.stringify(data)); // Store user data if necessary
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <div className="App">
      {isAuthenticated && location.pathname !== '/login' && <Sidebar />}
      <div className="content">
        <Routes>
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/transactions" element={isAuthenticated ? <TransactionHistory /> : <Navigate to="/login" />} />
          <Route path="/addTransaction" element={isAuthenticated ? <AddTransaction /> : <Navigate to="/login" />} />
          <Route path="/projects" element={isAuthenticated ? <ProjectList /> : <Navigate to="/login" />} />
          <Route path="/project" element={isAuthenticated ? <SelectedProject /> : <Navigate to="/login" />} />
          <Route path="/addProject" element={isAuthenticated ? <AddProject /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
