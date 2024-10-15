import React from 'react';
import './dashboard.css';
import { Chart, registerables } from 'chart.js';
import StatsCard from '../statsCard/StatsCard';
import { Line } from 'react-chartjs-2';

// Register chart.js components
Chart.register(...registerables);

const Dashboard = () => {
  // Define the chart data and configuration
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: [30, 40, 45, 50, 60, 70, 65, 80, 75, 85, 90, 100],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Expenses',
        data: [20, 30, 25, 35, 30, 50, 45, 40, 55, 50, 60, 70],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <div className="stats-section">
        <StatsCard 
          title="Revenue" 
          amount="$20,000" 
          percentage={15} 
          color="green" 
        />
        <StatsCard 
          title="Expenses" 
          amount="$12,000" 
          percentage={-5} 
          color="red" 
        />
        <StatsCard 
          title="Profit" 
          amount="$8,000" 
          percentage={10} 
          color="blue" 
        />
      </div>

      <div className="spending-report">
        <h2>Spending Report</h2>
        <div className="chart-container">
          <Line data={data} /> {/* Render the Line chart with the defined data */}
          <button className="view-report-button">View Report</button>
        </div>
        <div className="total-container">
          <h3>Total Income: 50.000 dt</h3>
          <h3>Total Expenses: 10.000 dt</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
