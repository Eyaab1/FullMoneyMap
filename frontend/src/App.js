import React from 'react';
import { Navigate } from 'react-router-dom';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar/sideBar';
import Dashboard from './components/dashboard/dashboard';
import StatsCard from './components/statsCard/StatsCard'; 
import Deadlines from './components/deadlines/deadlines';  
import ProjectList from './components/projectlist/projectList';
import SelectedProject from './components/projectlist/selectedProject'
import Login from './components/login/login'
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
<<<<<<< HEAD
          <Route path="/addTransaction" element={<AddTransaction />} />
=======
          <Route path="/projects" element={<ProjectList />} />
<<<<<<< HEAD
>>>>>>> 40aaa82aab6845b34eebaa31e539e35bced05c20
=======
          <Route path="/project" element={<SelectedProject />} />
>>>>>>> 00bb5ec747c867b38cefe271f79d05649a75f528
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;