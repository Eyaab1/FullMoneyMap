import React, { useState ,useEffect } from 'react';

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
      category: '' 
    });
    const [projects, setProjects] = useState([]);
  
    useEffect(() => {
     
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (user && user.prenom) {
        setFormData((prevState) => ({
          ...prevState,
          addedBy: user.prenom 
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
  
    // Find the project ID based on the project name
    const project = projects.find((proj) => proj.nom === formData.projectName);
    if (!project) {
      console.error('Project not found');
      return;
    }
  
    const url = formData.type === 'Income' 
      ? 'http://localhost:5000/api/transactions/revenu' 
      : 'http://localhost:5000/api/transactions/depense';
  
    const payload = {
      amount: formData.amount,
      date: formData.date,
      description: formData.description,
      addedBy: user.id, // Use the user's ID
      ...(formData.type === 'Income' 
          ? { id_projet: project.id } // Pass the project ID
          : { category: formData.category })
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
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
          <form className="add-transaction-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="addedBy">Added By</label>
              <input
                type="text"
                name="addedBy"
                value={formData.addedBy}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="projectName">Project Name</label>
              <select
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.nom}>
                    {project.nom}
                  </option>
                ))}
              </select>
            </div>

            {formData.type === 'Expense' && (
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-buttons">
            
              <button type="submit" className="add-button">Add </button>
              <Link to="/transactions">
                <button type="button" className="cancel-button">Cancel</button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
export default AddTransaction;
