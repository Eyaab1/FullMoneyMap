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
  const [projectFilter, setProjectFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

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
              // Fetch user details for addedBy
              const userResponse = await axios.get(
                `http://localhost:5000/api/utilisateurs/${transaction.addedBy}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              transaction.addedByName = userResponse.data.nom;

              // Fetch project name if transaction type is revenu
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
              }
            } catch (err) {
              console.error('Error fetching details:', err);
              transaction.addedByName = transaction.addedByName || 'Unknown';
              transaction.projectName = transaction.projectName || 'Unknown';
            }
            return transaction;
          })
        );

        setTransactions(transactionsWithDetails);
        setLoading(false);
      } catch (err) {
        setError('Error fetching transactions');
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleSortChange = (e) => setSortOption(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleTypeFilterChange = (e) => setTypeFilter(e.target.value);
  const handleProjectFilterChange = (e) => setProjectFilter(e.target.value);
  const handleCategoryFilterChange = (e) => setCategoryFilter(e.target.value);

  const filteredTransactions = transactions
    .filter((transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((transaction) => {
      if (typeFilter === 'income') return transaction.type === 'revenu';
      if (typeFilter === 'outcome') return transaction.type === 'depense';
      return true;
    })
    .filter((transaction) => {
      if (projectFilter) return transaction.projectName === projectFilter;
      return true;
    })
    .filter((transaction) => {
      if (categoryFilter) return transaction.depense_category === categoryFilter;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'dateAsc') return new Date(a.date) - new Date(b.date);
      if (sortOption === 'managerAsc') return a.addedByName.localeCompare(b.addedByName);
      return 0;
    });

  if (loading) return <div>Loading Transaction...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="transaction-history-container">
      <div className="transaction-history">
        <div className="transaction-header">
          <h3>Transaction History</h3>
          <button className="add-transaction-btn" onClick={() => navigate('/addTransaction')}>
            Add Transaction
          </button>
        </div>

        <table className="transaction-table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Source</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Added By</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{capitalizeFirstLetter(transaction.description)}</td>
                <td>
                  {transaction.type === 'depense' && transaction.depense_category
                    ? capitalizeFirstLetter(transaction.depense_category)
                    : transaction.type === 'revenu' && transaction.projectName
                    ? transaction.projectName
                    : ''}
                </td>
                <td>
                  {new Intl.NumberFormat('fr-TN', {
                    style: 'currency',
                    currency: 'TND',
                  }).format(transaction.amount)}
                </td>
                <td>
                  {new Date(transaction.date).toLocaleDateString('fr-TN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </td>
                <td>{capitalizeFirstLetter(transaction.addedByName)}</td>
                <td>{transaction.type === 'revenu' ? 'Income' : 'Outcome'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="filter-card">
        <h4>Filters</h4>
        <div className="search-bar">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by description..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="sort-dropdown">
          <label>Sort By</label>
          <select value={sortOption} onChange={handleSortChange}>
            <option value="">Select an option</option>
            <option value="dateAsc">Date (Ascending)</option>
            <option value="managerAsc">Manager (A-Z)</option>
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
        <div className="project-filter-dropdown">
          <label>Project</label>
          <select value={projectFilter} onChange={handleProjectFilterChange}>
            <option value="">All</option>
            {[
              ...new Set(transactions.map((t) => t.projectName).filter(Boolean)),
            ].map((project, idx) => (
              <option key={idx} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>
        <div className="category-filter-dropdown">
          <label>Category</label>
          <select value={categoryFilter} onChange={handleCategoryFilterChange}>
            <option value="">All</option>
            {[
              ...new Set(transactions.map((t) => t.depense_category).filter(Boolean)),
            ].map((category, idx) => (
              <option key={idx} value={category}>
                {capitalizeFirstLetter(category)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
