import React, { useEffect, useState } from 'react';
import './transactionHistory.css'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactions,setTransactions]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const capitalizeFirstLetter = (name) => {
    if (!name) return ''; // Handle empty names
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };
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
            'Authorization': `Bearer ${token}`
          }});

        const transactionsWithNames = await Promise.all(response.data.map(async (transaction) => {
          const userResponse = await axios.get(`http://localhost:5000/api/utilisateurs/${transaction.addedBy}`);
          
          return { ...transaction, addedByName: userResponse.data.nom }; 
        }));
        
        setTransactions(transactionsWithNames);   
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
            <th>Added By</th>
            <th>Type</th>
          </tr>
        </thead> 
        <tbody>
  {transactions.map((transaction) => (
    <tr key={transaction.id}>
      <td>{capitalizeFirstLetter(transaction.description)}</td>
      <td>{transaction.id}</td>
      <td>
        {new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(transaction.amount)}
      </td>
      <td>
        {new Date(transaction.date).toLocaleDateString('fr-TN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
      </td>
      <td>{capitalizeFirstLetter(transaction.addedByName)}</td>
      <td>{transaction.type === 'Income' ? 'Income' : 'Outcome'}</td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
