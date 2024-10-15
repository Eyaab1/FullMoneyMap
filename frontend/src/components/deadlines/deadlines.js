import React from 'react';
import './deadlines.css';

const UpcomingDeadlines = () => {
  const deadlines = [
    { title: 'Innovo', date: '29 Oct', time: '2:30pm', person: 'Abdellaoui Eya' },
    { title: 'Saturn', date: '1 Nov', time: '3:30pm', person: 'Anis Arfa' }
  ];

  return (
    <div className="upcoming-deadlines">
      <h2>Upcoming deadlines</h2>
      <ul>
        {deadlines.map((deadline, index) => (
          <li key={index} className="deadline-item">
            <div className="deadline-title">{deadline.title}</div>
            <div className="deadline-details">
              <span className="deadline-date">{deadline.date}</span>
              <span className="deadline-time">{deadline.time}</span>
            </div>
            <div className="deadline-person">{deadline.person}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingDeadlines;
