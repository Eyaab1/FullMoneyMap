import React, { useEffect, useState } from 'react';
import './transactionHistory.css'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactions,setTransactions]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  useEffect(()=>{
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');

      if (!token) {
        setError('Unauthorized access - No token found');
        setLoading(false);
        return;
      }
        const response = await axios.get('http://localhost:5000/api/transactions/all',
          {
          headers: {
            'Authorization': `Bearer ${token}`  // Attach token to the request
          }
        }
        );
        setTransactions(response.data);  
        setLoading(false);
      } catch (err) {
        setError('Error fetching transactions');
        setLoading(false);
      }
    };
    fetchTransactions();
    
  },[]);
  if(loading){
    return <div>Loading Transaction...</div>;
  }if (error){
    return <div>{error}</div>;
  }
  return (
    <div className="transaction-history">
      <div className="transaction-header">
        <h3>Transaction History</h3>
        <div className="transaction-buttons">
          <button className="view-all-btn">View All</button>
          <button className="add-transaction-btn" onClick={() => navigate('/addTransaction')}>
            Add transaction
          </button>
        </div>
      </div>
      
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>ID</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead> 
        <tbody>
          {transactions.map((item, index) => (
            <tr key={index}>
              <td>{item.transaction}</td>
              <td>{item.id}</td>
              <td style={{ color: item.color }}>{item.amount}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
