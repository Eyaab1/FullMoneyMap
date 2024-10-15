import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, amount, percentage, color }) => {
  return (
    <div className="stats-card" style={{ borderColor: color }}>
      <div className="stats-content">
        <h3>{title}</h3>
        <h2>{amount}</h2>
      </div>
      <div className="percentage" style={{ color }}>
        {percentage}%
      </div>
    </div>
  );
};

export default StatsCard;