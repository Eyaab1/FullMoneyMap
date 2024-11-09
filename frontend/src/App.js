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
import {jwtDecode} from 'jwt-decode';
import { PrimeReactProvider } from 'primereact/api';
const App = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    console.log("Token from localStorage:", token);
    console.log("User from localStorage:", user);

    if (token && user) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);
        const currentTime = Date.now() / 1000; 

        
        if (decodedToken.exp >= currentTime) {
          setIsAuthenticated(true);
        } else {
          logout(); 
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout(); 
      }
      
    }
    //hne !!!!!!
    else {
      setIsAuthenticated(false); 
    }
  }, []);


  const login = async (credentials, navigate) => {
    try {
      const response = await fetch('http://localhost:5000/api/utilisateurs/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      console.log('Response status:', response.status);
  
      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;
  
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthenticated(true); 
        navigate('/dashboard'); 
      } else {
        const errorData = await response.json(); 
        console.error('Login error response:', errorData); 
        alert(errorData.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred. Please try again later.');
    }
  };
  

  const logout = () => {
   
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    window.location.href = '/login'; 
  };
  return (
    <div className="App">
      {isAuthenticated && location.pathname !== '/login' && <Sidebar logout={logout} />}
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
