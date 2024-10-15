import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './addTransaction.css';



const AddTransaction = () => {
    const [formData, setFormData] = useState({
      addedBy: '',
      type: '', // Default to 'Outcome'
      date: '',
      amount: '',
      description: '',
      projectName: '', // This will be shown only if type is 'Income'
      category: '' 
    });
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formData);
      // Add form submission logic
    };
  
    return (
        <div className="page-container"> {/* Page wrapper to center the form */}
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
              />
            </div>
  
            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="">Select a type</option>
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
  
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </div>
            {formData.type === 'Income' && (
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Enter project name"
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

  
            <button type="submit" className="add-button">ADD</button>
          </form>
        </div>
      </div>
    );
  };
  
export default AddTransaction;
