import React, { useEffect, useState } from 'react';
import './deadlines.css';

const UpcomingDeadlines = () => {
  const [deadlines, setDeadlines] = useState([]);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await fetch('/api/projects/upcoming-deadlines?days=3');
        const data = await response.json();
        setDeadlines(data);
      } catch (error) {
        console.error('Error fetching deadlines:', error);
      }
    };

    fetchDeadlines();
    const interval = setInterval(fetchDeadlines, 24 * 60 * 60 * 1000); // Fetch daily

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="upcoming-deadlines">
      <h2>Upcoming Deadlines</h2>
      <ul>
        {deadlines.map((deadline) => (
          <li key={deadline.id} className="deadline-item">
            <div className="deadline-title">{deadline.nom}</div>
            <div className="deadline-details">
              <span className="deadline-date">{new Date(deadline.date_fin).toLocaleDateString()}</span>
              <span className="deadline-time">{new Date(deadline.date_fin).toLocaleTimeString()}</span>
            </div>
            <div className="deadline-person">
              {deadline.manager_nom} {deadline.manager_prenom}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingDeadlines;
