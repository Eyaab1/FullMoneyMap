import React from 'react';
import { Navigate } from 'react-router-dom';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar/sideBar';
import Dashboard from './components/dashboard/dashboard';
import ProjectList from './components/projectlist/projectList';
import SelectedProject from './components/projectlist/selectedProject'
import Login from './components/login/login'
import AddProject from './components/projectlist/addProject';
import './App.css'; 
import TransactionHistory from './components/transactionHistory/transactionHistory';
import AddTransaction from './components/addTransaction/addTransaction';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="content">
          {/*side bar tetna7a fel login mezelet*/}
          <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path='/login' element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/addTransaction" element={<AddTransaction />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/project" element={<SelectedProject />} />
          <Route path="/addProject" element={<AddProject />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;