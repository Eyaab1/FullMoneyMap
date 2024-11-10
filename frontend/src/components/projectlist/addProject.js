import React, { useState, useEffect } from 'react';
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
    const [chefs, setChefs] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch chefs de projet on component mount
    useEffect(() => {
        const fetchChefs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/utilisateurs/all?role=chef de projet');
                const data = await response.json();
                if (response.ok) {
                    setChefs(data);
                } else {
                    setError(data.error || 'Error fetching managers');
                }
            } catch (err) {
                console.error('Error:', err);
                setError('Network error. chefs');
            }
        };
        fetchChefs();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); 
        try {
            const response = await fetch('http://localhost:5000/api/projects/create', {
                method: 'POST',
                headers: 
                { 
                    'Content-Type': 'application/json' ,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nom: formData.name,
                    id_chef: formData.manager,
                    date_debut: formData.startDate,
                    date_fin: formData.deadline,
                    budget: parseFloat(formData.budget),
                    etat: formData.etat,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('Project added successfully');
                setFormData({
                    name: '',
                    manager: '',
                    startDate: '',
                    deadline: '',
                    budget: '',
                    etat: ''
                });
            } else {
                setError(data.error || 'Error adding project');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Network error. Please try again.');
        }
    };

    return (
        <div className="page-container">
            <div className="add-transaction-container">
                <h3>Add Project</h3>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <form onSubmit={handleSubmit} className="add-transaction-form">
                    <div className="form-group">
                        <label>Project name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter project's name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Manager</label>
                        <select
                            name="manager"
                            value={formData.manager}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select a manager</option>
                            {chefs.map((chef) => (
                                <option key={chef.id} value={chef.id}>
                                    {chef.nom} {chef.prenom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
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
                    <div className="form-group">
                        <label>State</label>
                        <select
                            name="etat"
                            value={formData.etat}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select a state</option>
                            <option value="en cours">En cours</option>
                            <option value="terminé">Terminé</option>
                        </select>
                    </div>
                    <div className="form-buttons">
                        <Link to="/projects"><button type="button" className="cancel-button">CANCEL</button></Link>
                        <button type="submit" className="add-button">ADD</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProject;
