import { React, useEffect, useState } from 'react';
import './dashboard.css';
import { Chart, registerables } from 'chart.js';
import StatsCard from '../statsCard/StatsCard';
import { Line } from 'react-chartjs-2';
import NavBar from '../navBar/navbar';
import Deadlines from '../deadlines/deadlines'
Chart.register(...registerables);

const Dashboard = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0); 
  const [totalExpenses, setTotalExpenses] = useState(0); 
  const [solde, setSolde] = useState(0);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const [revenuesResponse, expensesResponse] = await Promise.all([
          fetch('http://localhost:5000/api/transactions/revenues', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch('http://localhost:5000/api/transactions/depenses', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
        ]);

        if (revenuesResponse.ok) {
          const revenues = await revenuesResponse.json();
          setIncomeData(revenues);
          const totalRevenue = revenues.reduce((acc, curr) => acc + curr.amount, 0);
          setTotalRevenue(totalRevenue); 
        }  else {
          throw new Error('Failed to fetch revenues');
        }

        if (expensesResponse.ok) {
          const expenses = await expensesResponse.json();
          setExpenseData(expenses);
          const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
          setTotalExpenses(totalExpenses);
        }else {
          throw new Error('Failed to fetch expenses');
        }
        setError(null);

      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError(error.message);
      }
    } else {
      console.error('No token found, please log in.');
      setError('Authentication error: No token found. Please log in.');
      
    }
  };

  useEffect(() => {
    setSolde(totalRevenue - totalExpenses);
  }, [totalRevenue, totalExpenses]);

  useEffect(() => {
    fetchTransactions(); 
  }, []);

  const chartData = {
    labels: incomeData.map(item => new Date(item.date).toLocaleDateString()), 
    datasets: [
      {
        label: 'Income',
        data: incomeData.map(item => item.amount),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Expenses',
        data: expenseData.map(item => item.amount),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <>
    <div className='navContainer'><NavBar /></div>
    <div className="container">
      <div className='rightSide'>
        <Deadlines />
      </div>
      <div className='main'>
        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}
        <div className="stats-section">
          <StatsCard
            title="Total Revenue"
            amount={`${totalRevenue.toFixed(2)} dt`}
            color="green" />
          <StatsCard
            title="Total Expenses"
            amount={`${totalExpenses.toFixed(2)} dt`}
            color="red" />
          <StatsCard
            title="Solde"
            amount={`${solde.toFixed(2)} dt`}
            color={solde >= 0 ? "blue" : "red"} />
        </div>

        <div className="spending-report">
          <h2>Spending Report</h2>
          <div className="chart-container">
            <Line data={chartData} />
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default Dashboard;
