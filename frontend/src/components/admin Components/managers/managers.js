import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newManager, setNewManager] = useState({
    prenom: '',
    nom: '',
    email: '',
    cin: '', // Add CIN field
    role: 'chef de projet', // Set role to "chef de projet"
  });

  // Fetching managers
  useEffect(() => {
    const fetchManagers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/utilisateurs/role/chef%20de%20projet', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched Managers:', response.data); // Log to check fetched data
        setManagers(response.data);
      } catch (err) {
        console.error('Error fetching managers:', err);
        setError('Failed to fetch managers');
      } finally {
        setLoading(false); // Set loading to false after the fetch attempt
      }
    };

    fetchManagers();
  }, []);

  // Remove manager
  const removeManager = async (managerId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized access - No token found');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/utilisateurs/${managerId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setManagers(managers.filter(manager => manager.id !== managerId));
    } catch (err) {
      setError('Failed to delete manager');
    }
  };

  // Add manager
  const handleAddManager = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized access - No token found');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/utilisateurs/create', newManager, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token
        },
      });

      setManagers([...managers, response.data]); // Add the new manager to the list
      setShowForm(false); // Hide the form after adding
      setNewManager({ prenom: '', nom: '', email: '', role: 'chef de projet' }); // Reset form fields
    } catch (err) {
      setError('Failed to add manager');
    }
  };


  return (
    <div className="project-list-container">
      <div className="project-header">
        <h3>Project Managers List</h3>
        <div className="project-buttons">
          <button className="add-project-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Project Manager'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="add-manager-form">
          <h4>Add New Project Manager</h4>
          <div className="form-fields">
            <input
              type="text"
              placeholder="First Name"
              value={newManager.prenom}
              onChange={(e) => setNewManager({ ...newManager, prenom: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newManager.nom}
              onChange={(e) => setNewManager({ ...newManager, nom: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newManager.email}
              onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
            />
          </div>
          <button className="add-project-btn" onClick={handleAddManager}>Save</button>
        </div>
      )}

      <div className="project-table">
        <div className="table-header">
          <p>Full name</p>
          <p>Email</p>
        </div>
        {managers.map((manager) => (
          <div key={manager.id} className="table-row">
            <p>{manager.prenom} {manager.nom}</p>
            <p>{manager.email}</p>
            <p className="remove-icon" onClick={() => removeManager(manager.id)}>
              x
            </p> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default Managers;