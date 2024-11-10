import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
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
        console.log('Fetched Freelancers:', response.data); // Log to check fetched data
        setFreelancers(response.data);
      } catch (err) {
        console.error('Error fetching freelancers:', err);
        setError('Failed to fetch freelancers');
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  // Handle form field changes
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
      setShowForm(false); // Hide the form after adding
      setNewFreelancer({ nom: '', prenom: '', specialty: '' }); // Reset form fields
    } catch (err) {
      setError('Failed to add freelancer');
    }
  };

  return (
    <div className="project-list-container">
      <div className="project-header">
        <h3>Freelancers List</h3>
        <div className="project-buttons">
          <button className="add-project-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Freelancer'}
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          {showForm && (
            <div className="add-freelancer-form">
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
                  <option value="Social Media Manager">Social Media Manager</option>
                </select>
              </div>
              <button className="add-project-btn" onClick={handleAddFreelancer}>
                Save
              </button>
            </div>
          )}

          <div className="project-table">
            <div className="table-header">
              <p>Full name</p>
              <p>specialty</p>
            </div>
            {freelancers.map((freelancer) => (
              <div key={freelancer.id} className="table-row">
                <p>
                  {freelancer.prenom} {freelancer.nom}
                </p>
                <p>{freelancer.specialty}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Freelancers;
