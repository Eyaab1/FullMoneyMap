import React, { useEffect, useState } from 'react';
import './financiers.css';
import axios from 'axios';
import adminPhoto from '../../../admin.png';
import ConfirmModal from '../../confirm/confirm'; // Import the custom ConfirmModal
import { useNavigate } from 'react-router-dom';

const Financiers = () => {
  const [financiers, setFinanciers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // New state for confirmation modal
  const [financierToDelete, setFinancierToDelete] = useState(null); // Store financier ID to delete
  const [newFinancier, setNewFinancier] = useState({
    prenom: '',
    nom: '',
    email: '',
    role: 'financier',
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  // Fetch financiers
  useEffect(() => {
    const fetchFinanciers = async () => {
      setLoading(true); // Make sure loading is set to true initially
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized access - No token found');
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get('http://localhost:5000/api/utilisateurs/role/financier', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setFinanciers(response.data);
      } catch (err) {
        setError('Failed to fetch financiers');
      }
      setLoading(false);
    };
  
    fetchFinanciers();
  }, []);
  

  // Handle add new financier
  const handleAddFinancier = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized access - No token found');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/utilisateurs/create', newFinancier, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setFinanciers([...financiers, response.data]);
      setShowModal(false);
      setNewFinancier({ prenom: '', nom: '', email: '', role: 'financier' }); // Reset form fields
    } catch (err) {
      setError('Failed to add financier');
    }
  };

  // Trigger confirmation modal before deletion
  const removeFinancier = (financierId) => {
    setFinancierToDelete(financierId); // Store the financier ID to delete
    setShowConfirmModal(true); // Show the confirmation modal
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized access - No token found');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/utilisateurs/${financierToDelete}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setFinanciers(financiers.filter(financier => financier.id !== financierToDelete));
      setShowConfirmModal(false); // Close the modal after deletion
    } catch (err) {
      setError('Failed to delete financier');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false); 
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
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

      <div className="project-list-container">
        {/* Show confirmation modal */}
        {showConfirmModal && (
          <ConfirmModal
            message="Are you sure you want to delete this financier?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}

        <div className="project-header">
          <h3>Financial List</h3>
          <div className="project-buttons">
            <button className="add-project-btn" onClick={() => setShowModal(!showModal)}>
              {showModal ? 'Cancel' : 'Add Financial'}
            </button>
          </div>
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={() => setShowModal(false)}>
                &times;
              </span>
              <h4>Add New Financial</h4>
              <div className="form-fields">
                <input
                  type="text"
                  placeholder="First Name"
                  value={newFinancier.prenom}
                  onChange={(e) => setNewFinancier({ ...newFinancier, prenom: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newFinancier.nom}
                  onChange={(e) => setNewFinancier({ ...newFinancier, nom: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newFinancier.email}
                  onChange={(e) => setNewFinancier({ ...newFinancier, email: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button className="save-btn" onClick={handleAddFinancier}>Save</button>
                <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="project-table">
          <div className="table-headerFinancier">
            <p>First name</p>
            <p>Last Name</p>
            <p>Email</p>
            <p>Actions</p>
          </div>
          {financiers.map((financier) => (
            <div className="table-row" key={financier.id}>
              <p>{financier.prenom}</p>
              <p>{financier.nom}</p>
              <p>{financier.email}</p>
              <button className="delete-btn" onClick={() => removeFinancier(financier.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Financiers;
