import React, { useEffect, useState } from 'react';
import './deadlines.css';

const UpcomingDeadlines = () => {
  const [deadlines, setDeadlines] = useState([]);
  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await fetch('http://localhost:5000/api/projects/upcomingDeadlines?days=7', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setDeadlines(data);
        } else {
          console.error('Failed to fetch upcoming deadlines');
        }
      } catch (error) {
        console.error('Error fetching deadlines:', error);
      }
    };

    fetchDeadlines();
  }, []);
  const capitalizeFirstLetter = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <div className="upcoming-deadlines">
      <h2>Upcoming Deadlines</h2>
      <ul>
        {deadlines.map((deadline) => (
          <li key={deadline.id} className="deadline-item">
            <div className="deadline-left">
              <div className="deadline-title">{capitalizeFirstLetter(deadline.nom)}</div>
              <div className="deadline-person">
                {capitalizeFirstLetter(deadline.manager_nom)} {capitalizeFirstLetter(deadline.manager_prenom)}
              </div>
            </div>
            <div className="deadline-right">
              <span className="deadline-date">{new Date(deadline.date_fin).toLocaleDateString()}</span>
              <br />
             
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingDeadlines;
