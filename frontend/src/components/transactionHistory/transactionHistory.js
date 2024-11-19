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
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const incomeCategories = [
    'Client Payment',
    'Investment',
    'Grant or Funding',
    'Partnership',
    'Other',
  ];

  const outcomeCategories = [
    'Salaires et rémunérations',
    'Frais administratifs',
    'Marketing et publicité',
    'Technologie et logiciels',
    'Frais de déplacement',
  ];

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
            Authorization: `Bearer ${token}`,
          },
        });

        const transactionsWithDetails = await Promise.all(
          response.data.map(async (transaction) => {
            try {
           
              const userResponse = await axios.get(
                `http://localhost:5000/api/utilisateurs/${transaction.addedBy}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              transaction.addedByName = userResponse.data.nom;

              // Fetch project name and description if transaction type is revenu
              if (transaction.type === 'revenu' && transaction.revenue_project_id) {
                const projectResponse = await axios.get(
                  `http://localhost:5000/api/projects/projet/${transaction.revenue_project_id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                transaction.projectName = projectResponse.data.nom;
                transaction.Description = transaction.description || 'No description available';
              }
            } catch (err) {
              console.error('Error fetching details:', err);
              transaction.addedByName = transaction.addedByName || 'Unknown';
              transaction.projectName = transaction.projectName || 'Unknown';
              transaction.Description = transaction.Description || 'No description available';
            }
            return transaction;
          })
        );

        setTransactions(transactionsWithDetails);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error fetching transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleSortChange = (e) => setSortOption(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleTypeFilterChange = (e) => setTypeFilter(e.target.value);
  const handleCategoryFilterChange = (e) => setCategoryFilter(e.target.value);
  const filteredTransactions = transactions
  .filter((transaction) => {
  
    const description = transaction.description ? transaction.description.toLowerCase() : '';
    const search = searchTerm.toLowerCase();
    return description.includes(search) || transaction.type.toLowerCase().includes(search);
  })
  .filter((transaction) => {

    if (typeFilter === 'income') return transaction.type === 'revenu';
    if (typeFilter === 'outcome') return transaction.type === 'depense';
    return true;
  })
  .filter((transaction) => {

    if (categoryFilter) {
      if (typeFilter === 'income') {
        return transaction.description === categoryFilter;
      }
      if (typeFilter === 'outcome') {
        return transaction.category === categoryFilter;
      }
      return false;
    }
    return true;
  })
  .sort((a, b) => {
    // Sorting logic
    if (sortOption === 'dateAsc') return new Date(a.date) - new Date(b.date);
    if (sortOption === 'managerAsc') return a.addedByName.localeCompare(b.addedByName);
    return 0;
  });


  if (loading) {
    return <div>Loading Transaction...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="transaction-history-container">
      <div className="transaction-history">
        <div className="transaction-header">
          <h3>Transaction History</h3>
          <div className="transaction-controls">
          
            <button
              className="add-transaction-btn"
              onClick={() => navigate('/addTransaction')}
            >
              Add Transaction
            </button>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="table-container">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Source of Transaction</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Added By</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.type === 'revenu' ? 'Income' : 'Outcome'}</td>
                  <td>
                    {transaction.type === 'revenu' && transaction.projectName ? (
                      `Project: ${transaction.projectName} - ${transaction.Description}`
                    ) : (
                      capitalizeFirstLetter(transaction.description) 
                    )}
                  </td>
                  <td>
                    {new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(
                      transaction.amount
                    )}
                  </td>
                  <td>
                    {new Date(transaction.date).toLocaleDateString('fr-TN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </td>
                  <td>{capitalizeFirstLetter(transaction.addedByName)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Card Section */}
      <div className="filter-card">
        <h4>Filters</h4>
        <div className="form-group">
          <label>Search by Description</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
          />
        </div>
        <div className="form-group">
          <label>Sort By</label>
          <select value={sortOption} onChange={handleSortChange}>
            <option value="">Select</option>
            <option value="dateAsc">Date (Ascending)</option>
            <option value="managerAsc">Manager (A-Z)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={typeFilter} onChange={handleTypeFilterChange}>
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="outcome">Outcome</option>
          </select>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={categoryFilter} onChange={handleCategoryFilterChange}>
            <option value="">All</option>
            {typeFilter === 'income' &&
              incomeCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            {typeFilter === 'outcome' &&
              outcomeCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
