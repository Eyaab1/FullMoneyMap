import React, { useEffect, useState } from 'react';
import './transactionHistory.css'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const capitalizeFirstLetter = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Unauthorized access - No token found');
          setLoading(false);
          return;
        }
        
        const response = await axios.get('http://localhost:5000/api/transactions/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const transactionsWithDetails = await Promise.all(response.data.map(async (transaction) => {
          try {
            // Fetch user details for addedBy
            const userResponse = await axios.get(`http://localhost:5000/api/utilisateurs/${transaction.addedBy}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            });
            transaction.addedByName = userResponse.data.nom;

            // Fetch project name if transaction type is revenu
            if (transaction.type === 'revenu' && transaction.revenue_project_id) {
              const projectResponse = await axios.get(`http://localhost:5000/api/projects/projet/${transaction.revenue_project_id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                }
              });
              transaction.projectName = projectResponse.data.nom;
            }
          } catch (err) {
            console.error('Error fetching details:', err);
            transaction.addedByName = transaction.addedByName || 'Unknown';
            transaction.projectName = transaction.projectName || 'Unknown';
          }
          return transaction;
        }));
        
        setTransactions(transactionsWithDetails);   
        setLoading(false);
      } catch (err) {
        setError('Error fetching transactions');
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };

  const filteredTransactions = transactions
    .filter((transaction) => transaction.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((transaction) => {
      if (typeFilter === 'income') return transaction.type === 'revenu';
      if (typeFilter === 'outcome') return transaction.type === 'depense';
      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'dateAsc') {
        return new Date(a.date) - new Date(b.date);
      }  else if (sortOption === 'managerAsc') {
        return a.addedByName.localeCompare(b.addedByName);
      } 
      return 0;
    });

  if (loading) {
    return <div>Loading Transaction...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="transaction-history">
      <div className="transaction-header">
        <h3>Transaction History</h3>
        <div className="transaction-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search.."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="sort-dropdown">
            <label>Sort By </label>
            <select value={sortOption} onChange={handleSortChange}>
              <option value="">Select an option</option>
              <option value="dateAsc">Date (Ascending)</option>
              <option value="managerAsc">Project Manager (A-Z)</option>
            </select>
          </div>
          <div className="type-filter-dropdown">
            <label>Type</label>
            <select value={typeFilter} onChange={handleTypeFilterChange}>
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="outcome">Outcome</option>
            </select>
          </div>
          <button className="add-transaction-btn" onClick={() => navigate('/addTransaction')}>
            Add Transaction
          </button>
        </div>
      </div>

      <table className="transaction-table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Source/des</th>
            <th>ID</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Added By</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>
                {capitalizeFirstLetter(transaction.description)}
                
              </td>
              <td>
              
                  {transaction.type === 'depense' && transaction.depense_category ? (
                    `  ${capitalizeFirstLetter(transaction.depense_category)}`
                  ) : transaction.type === 'revenu' && transaction.projectName ? (
                    `  ${transaction.projectName}`
                  ) : ''}
                
              </td>

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
              <td>
                {transaction.type === 'revenu' ? 'Income' : 'Outcome'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
