import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Financiers = () => {
  const [financiers, setFinanciers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newFinancier, setNewFinancier] = useState({
    prenom: '',
    nom: '',
    email: '',
    role: 'financier' // Set role to "financier"
  });

  useEffect(() => {
    const fetchFinanciers = async () => {
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
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch financiers');
        setLoading(false);
      }
    };

    fetchFinanciers();
  }, []);

  const removeFinancier = async (financierId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Unauthorized access - No token found');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/utilisateurs/${financierId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setFinanciers(financiers.filter(financier => financier.id !== financierId));
    } catch (err) {
      setError('Failed to delete financier');
    }
  };

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
      setShowForm(false);
      setNewFinancier({ prenom: '', nom: '', email: '', role: 'financier' }); // Reset form fields, including role
    } catch (err) {
      setError('Failed to add financier');
    }
  };

  return (
    <div className="project-list-container">
      <div className="project-header">
        <h3>Financial List</h3>
        <div className="project-buttons">
          <button className="add-project-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Financial'}
          </button>
        </div>
      </div>

      {showForm && (
  <div className="add-financier-form">
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
    <button className="add-project-btn" onClick={handleAddFinancier}>Save</button>
  </div>
)}

      <div className="project-table">
        <div className="table-header">
          <p>Full name</p>
          <p>Email</p>
        </div>
        {financiers.map((financier) => (
          <div key={financier.id} className="table-row">
            <p>{financier.prenom} {financier.nom}</p>
            <p>{financier.email}</p>
            <p className="remove-icon" onClick={() => removeFinancier(financier.id)}>
              x
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Financiers;
