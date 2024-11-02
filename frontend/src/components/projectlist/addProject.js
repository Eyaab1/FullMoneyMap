import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './addProject.css';



const AddProject = () => {
    const [formData, setFormData] = useState({
      name: '',
      manager: '', 
      startDate: '',
      deadline: '',
      budget: '',
      etat: ''
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
    };
  
    return (
        <div className="page-container"> 
        <div className="add-transaction-container">
          <h3>Add Project</h3>
          <form onSubmit={handleSubmit} className="add-transaction-form">
            
            <div className="form-group">
              <label>Project name</label>
              <input
                manager="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project's name"
              />
            </div>
  
            <div className="form-group">
              <label>manager</label>
              <select
                name="manager"
                value={formData.manager}
                onChange={handleChange}
              >
                {/*liste des managers*/}
                <option value="" disabled >Select a manager</option>
                {/* <option value="Income">Income</option>
                <option value="Outcome">Outcome</option> */}
              </select>
            </div>
  
            
  
            <div className="form-group">
              <label>startDate</label>
              <input
                manager="startDate"
                name="startDate"
                type='date'
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
  
            <div className="form-group">
              <label>deadline</label>
              <input
                manager="number"
                name="deadline"
                type='date'
                value={formData.deadline}
                onChange={handleChange}
                placeholder="Enter deadline"
              />
            </div>
  
            <div className="form-group">
                <label>Budget</label>
                <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="Enter budget"
                />
            </div>

            

  
            <div className="form-buttons">
            <Link to="/projects"> <button type="button" className="cancel-button">CANCEL</button> </Link>
            
    <button manager="submit" className="add-button">ADD</button>
    
  </div>

          </form>
        </div>
      </div>
    );
  };
  
export default AddProject;
