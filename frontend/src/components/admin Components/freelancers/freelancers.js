import React, { useEffect, useState } from 'react';
import './freelancers.css';
import ConfirmModal from '../../confirm/confirm';  // Custom confirmation modal
import axios from 'axios';
import adminPhoto from '../../../admin.png';
import { useNavigate } from 'react-router-dom';

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [freelancerToDelete, setFreelancerToDelete] = useState(null);
  const [newFreelancer, setNewFreelancer] = useState({
    prenom: '',
    nom: '',
    specialty: '',
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchFreelancers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/freelancers/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setFreelancers(response.data);
      } catch (err) {
        setError('Failed to fetch freelancers');
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFreelancer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddFreelancer = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized access - No token found');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/freelancers/add', newFreelancer, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setFreelancers((prevFreelancers) => [...prevFreelancers, response.data]);
      setShowModal(false);
      setNewFreelancer({ prenom: '', nom: '', specialty: '' });
    } catch (err) {
      setError('Failed to add freelancer');
    }
  };

  const removeFreelancer = (freelancerId) => {
    setFreelancerToDelete(freelancerId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized access - No token found');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/freelancers/${freelancerToDelete}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setFreelancers(freelancers.filter((freelancer) => freelancer.id !== freelancerToDelete));
      setShowConfirmModal(false);
    } catch (err) {
      setError('Failed to delete freelancer');
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

      <div className="freelancer-list-container">
        {showConfirmModal && (
          <ConfirmModal
            message="Are you sure you want to delete this freelancer?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}

        <div className="freelancer-header">
          <h3>Freelancers List</h3>
          <div className="freelancer-buttons">
            <button className="add-freelancer-btn" onClick={() => setShowModal(!showModal)}>
              {showModal ? 'Cancel' : 'Add Freelancer'}
            </button>
          </div>
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
              <h4>Add New Freelancer</h4>
              <div className="form-fields">
                <input
                  type="text"
                  placeholder="First Name"
                  value={newFreelancer.prenom}
                  onChange={(e) => setNewFreelancer({ ...newFreelancer, prenom: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newFreelancer.nom}
                  onChange={(e) => setNewFreelancer({ ...newFreelancer, nom: e.target.value })}
                />
                <label>Specialty</label>
                <select
                  name="specialty"
                  value={newFreelancer.specialty}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select a specialty</option>
                  <option value="Front-End Developer">Front-End Developer</option>
                  <option value="Back-End Developer">Back-End Developer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Graphic Designer">Graphic Designer</option>
                  <option value="Mobile Developer">Mobile Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Social Media freelancer">Social Media freelancer</option>
                </select>
              </div>
              <div className="modal-actions">
                <button className="save-btn" onClick={handleAddFreelancer}>Save</button>
                <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="freelancer-table">
          <div className="table-header">
            <p>First Name</p>
            <p>Last Name</p>
            <p>Specialty</p>
            <p>Actions</p>
          </div>
          {freelancers.map((freelancer) => (
            <div className="table-row" key={freelancer.id}>
              <p>{freelancer.prenom}</p>
              <p>{freelancer.nom}</p>
              <p>{freelancer.specialty}</p>
              <button className="delete-btn" onClick={() => removeFreelancer(freelancer.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Freelancers;
