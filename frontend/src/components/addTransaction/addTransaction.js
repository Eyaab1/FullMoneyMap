import React, { useState, useEffect } from 'react';
import './addTransaction.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AddTransaction = () => {
  const [formData, setFormData] = useState({
    addedBy: '',
    type: '',
    date: '',
    amount: '',
    description: '',
    projectName: '',
    category: '',
    incomeSource: 'Project', // Default to project for income
    descriptionInput: '', // For user-typed description when 'Other' is selected
  });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.prenom) {
      setFormData((prevState) => ({
        ...prevState,
        addedBy: user.prenom,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/projects/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      console.error('User not found in localStorage');
      return;
    }

    const project = formData.type === 'Income' && formData.incomeSource === 'Project'
      ? projects.find((proj) => proj.nom === formData.projectName)
      : null;

    const url = formData.type === 'Income'
      ? 'http://localhost:5000/api/transactions/revenu'
      : 'http://localhost:5000/api/transactions/depense';

    const payload = {
      amount: formData.amount,
      date: formData.date,
      description: formData.incomeSource === 'Other' ? formData.descriptionInput : formData.description,
      addedBy: user.id,
      ...(formData.type === 'Income' && formData.incomeSource === 'Project'
        ? { id_projet: project?.id }
        : { category: formData.category }),
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Transaction added:', data);
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Error adding transaction:', errorData.error);
        } else {
          console.error('Non-JSON response received:', await response.text());
        }
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="add-transaction-container">
        <h3>Add Transaction</h3>
        <form onSubmit={handleSubmit} className="add-transaction-form">
          <div className="form-group">
            <label>Added by</label>
            <input
              type="text"
              name="addedBy"
              value={formData.addedBy}
              onChange={handleChange}
              placeholder="Enter your name"
              disabled
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="" disabled>Select a type</option>
              <option value="Income">Income</option>
              <option value="Outcome">Outcome</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
            />
          </div>

          {formData.type === 'Income' && (
            <div className="form-group">
              <label>Is the income from a project?</label>
              <div>
                <input
                  type="radio"
                  id="fromProject"
                  name="incomeSource"
                  value="Project"
                  checked={formData.incomeSource === 'Project'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      incomeSource: e.target.value,
                      projectName: '',
                      description: '',
                      descriptionInput: '', // Reset the input for other sources
                    })
                  }
                />
                <label htmlFor="fromProject">Yes</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="otherSource"
                  name="incomeSource"
                  value="Other"
                  checked={formData.incomeSource === 'Other'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      incomeSource: e.target.value,
                      projectName: '',
                      description: '',
                      descriptionInput: '', // Reset the input for other sources
                    })
                  }
                />
                <label htmlFor="otherSource">No</label>
              </div>
            </div>
          )}

          {formData.type === 'Income' && formData.incomeSource === 'Project' && (
            <div className="form-group">
              <label>Project Name</label>
              <select
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
              >
                <option value="" disabled>Select a project</option>
                {projects.map((projet) => (
                  <option key={projet.id} value={projet.nom}>
                    {projet.nom}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </div>

          {formData.type === 'Income' && formData.incomeSource === 'Other' && (
            <div className="form-group">
              <label>Source</label>
              <select
                name="description"
                value={formData.description}
                onChange={handleChange}
              >
                <option value="" disabled>Select a source</option>
                <option value="Client Payment">Client Payment</option>
                <option value="Investment">Investment</option>
                <option value="Grant or Funding">Grant or Funding</option>
                <option value="Royalties">Royalties</option>
                <option value="Partnership">Partnership</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          {formData.type === 'Income' && formData.incomeSource === 'Other' && formData.description === 'Other' && (
            <div className="form-group">
              <label>Type your source</label>
              <input
                type="text"
                name="descriptionInput"
                value={formData.descriptionInput}
                onChange={handleChange}
                placeholder="Type your custom source"
              />
            </div>
          )}

          {formData.type === 'Outcome' && (
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                <option value="Salaires et rémunérations">
                  Salaires et rémunérations
                </option>
                <option value="Frais administratifs">
                  Frais administratifs
                </option>
                <option value="Marketing et publicité">
                  Marketing et publicité
                </option>
                <option value="Technologie et logiciels">
                  Technologie et logiciels
                </option>
                <option value="Frais de déplacement">
                  Frais de déplacement
                </option>
              </select>
            </div>
          )}

          <div className="form-buttons">
            <Link to="/transactions">
              <button type="button" className="cancel-button">
                Cancel
              </button>
            </Link>
            <button type="submit" className="submit-button">Add Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
