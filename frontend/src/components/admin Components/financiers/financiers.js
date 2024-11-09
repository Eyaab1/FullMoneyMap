import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Financiers = () => {
  const [financiers, setFinanciers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      // Make an API call to delete the financier from the backend
      await axios.delete(`http://localhost:5000/api/utilisateurs/${financierId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the financier from the state (UI)
      setFinanciers(financiers.filter(financier => financier.id !== financierId));
    } catch (err) {
      setError('Failed to delete financier');
    }
  };

  return (
    <div className="project-list-container">
      <div className="project-header">
        <h3>Financial List</h3>
        <div className="project-buttons">
          <button className="add-project-btn">
            Add Financial
          </button>
        </div>
      </div>
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
