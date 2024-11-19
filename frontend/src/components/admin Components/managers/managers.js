import React, { useEffect, useState } from 'react';
import './managers.css'; // Use this for the popup and styling
import axios from 'axios';
import adminPhoto from '../../../admin.png'; // Make sure to import admin photo
import ConfirmModal from '../../confirm/confirm';  // Import the custom ConfirmModal
import { useNavigate } from 'react-router-dom';

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // New state for the confirm modal
  const [managerToDelete, setManagerToDelete] = useState(null); // Store the manager ID to delete
  const [newManager, setNewManager] = useState({
    prenom: '',
    nom: '',
    email: '',
    role: 'chef de projet',
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Handle dropdown menu on hover
  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  // Fetch managers
  useEffect(() => {
    const fetchManagers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized access - No token found');
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
        setManagers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch managers');
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  // Add new manager
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
          Authorization: `Bearer ${token}`,
        },
      });

      setManagers([...managers, response.data]);
      setShowModal(false);
      setNewManager({ prenom: '', nom: '', email: '', role: 'chef de projet' }); // Reset form fields
    } catch (err) {
      setError('Failed to add manager');
    }
  };

  // Trigger confirmation modal before deletion
  const removeManager = (managerId) => {
    setManagerToDelete(managerId); // Store manager ID to delete
    setShowConfirmModal(true); // Show confirmation modal
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized access - No token found');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/utilisateurs/${managerToDelete}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setManagers(managers.filter(manager => manager.id !== managerToDelete));
      setShowConfirmModal(false); // Close confirm modal after deletion
    } catch (err) {
      setError('Failed to delete manager');
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowConfirmModal(false); // Close confirm modal without deletion
  };

  // Go back button functionality
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      {/* Navbar Section */}
      <div className="navbar">
        <div className="navbarLogo">
          <h2>MoneyMap</h2>
          <button onClick={handleGoBack} className="goBackButton">← </button>
        </div>
        <div
          className="navbarAdmin"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="adminText">Admin</span>
          <img src={adminPhoto} alt="Admin" className="adminPhoto" />
          {showDropdown && (
            <div className="dropdownMenu">
              <button onClick={logout} className="dropdownButton">Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Managers List Section */}
      <div className="project-list-container1">
        {/* Show the confirmation modal */}
        {showConfirmModal && (
          <ConfirmModal
            message="Are you sure you want to delete this manager?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}

        <div className="project-header1">
          <h3>Project Managers List</h3>
          <div className="project-buttons1">
            <button className="add-project-btn1" onClick={() => setShowModal(!showModal)}>
              {showModal ? 'Cancel' : 'Add Manager'}
            </button>
          </div>
        </div>

        {showModal && (
          <div className="modal1">
            <div className="modal-content1">
              <span className="close-button1" onClick={() => setShowModal(false)}>
                &times;
              </span>
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
              <div className="modal-actions">
                <button className="save-btn" onClick={handleAddManager}>
                  Save
                </button>
                <button className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="project-table1">
          <div className="table-header1">
            <p>First Name</p>
            <p>Last Name</p>
            <p>Email</p>
            <p>Actions</p>
          </div>
          {managers.map((manager) => (
            <div className="table-row1" key={manager.id}>
              <p>{manager.prenom}</p>
              <p>{manager.nom}</p>
              <p>{manager.email}</p>
              <button className="delete-btn1" onClick={() => removeManager(manager.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Managers;
