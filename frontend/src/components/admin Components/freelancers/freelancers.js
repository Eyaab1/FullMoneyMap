import React, { useEffect, useState } from 'react';
import './freelancers.css';
import ConfirmModal from '../../confirm/confirm';  // Custom confirmation modal
import axios from 'axios';

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // New state for confirm modal
  const [freelancerToDelete, setFreelancerToDelete] = useState(null); // Store the freelancer ID to delete
  const [newFreelancer, setNewFreelancer] = useState({
    prenom: '',
    nom: '',
    specialty: '',
  });

  // Fetch freelancers
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

  // Add freelancer
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
      setNewFreelancer({ nom: '', prenom: '', specialty: '' });
    } catch (err) {
      setError('Failed to add freelancer');
    }
  };

  // Trigger confirmation modal before deletion
  const removeFreelancer = (freelancerId) => {
    setFreelancerToDelete(freelancerId); // Store freelancer ID to delete
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
      await axios.delete(`http://localhost:5000/api/freelancers/${freelancerToDelete}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setFreelancers(freelancers.filter(freelancer => freelancer.id !== freelancerToDelete));
      setShowConfirmModal(false); // Close confirm modal after deletion
    } catch (err) {
      setError('Failed to delete freelancer');
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowConfirmModal(false); // Close confirm modal without deletion
  };

  return (
    <div className="freelancer-list-container">
      {/* Show the confirmation modal */}
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

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
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
                  <button className="save-btn" onClick={handleAddFreelancer}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="freelancer-table">
            <div className="table-header">
              <p>First Name</p>
              <p>Last Name</p>
              <p>Specialty</p>
              <p></p>
            </div>
            {freelancers.map((freelancer) => (
              <div className="table-row" key={freelancer.id}>
                <p>{freelancer.prenom}</p>
                <p> {freelancer.nom}</p>
                <p>{freelancer.specialty}</p>
                <button className="delete-btn" onClick={() => removeFreelancer(freelancer.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Freelancers;
