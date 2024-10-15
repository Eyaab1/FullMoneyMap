import React from 'react';
import './transactionHistory.css'; 
import { useNavigate } from 'react-router-dom';
const transactions = [
  { transaction: 'Rent', id: '#7890328', amount: '- 13.000 dt', date: '16 Jan 2:30pm', color: 'red' },
  { transaction: 'Technologie et logiciels', id: '#3948509', amount: '- 24.000 dt', date: '15 Jan 3:30pm', color: 'red' },
  { transaction: 'Services pour consulting', id: '#2980298', amount: '+ 50.000 dt', date: '14 Jan 2:30pm', color: 'green' },
];

const TransactionHistory = () => {
  const navigate = useNavigate();
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
        </thead> b
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
