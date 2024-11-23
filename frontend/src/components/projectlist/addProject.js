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
        etat: '',
        freelancer: '',
        salaire: ''
    });
    const [chefs, setChefs] = useState([]);
    const [freelancers, setFreelancers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch chefs de projet
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Unauthorized access - No token found');
            return;
        }
        const fetchChefs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/utilisateurs/role/chef de projet', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setChefs(data);
                } else {
                    setError(data.error || 'Error fetching managers');
                }
            } catch (err) {
                console.error('Error:', err);
                setError('Network error while fetching chefs.');
            }
        };

        const fetchFreelancers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/freelancers/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setFreelancers(data);
                } else {
                    setError(data.error || 'Error fetching freelancers');
                }
            } catch (err) {
                console.error('Error:', err);
                setError('Network error while fetching freelancers.');
            }
        };
        fetchChefs();
        fetchFreelancers();
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
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nom: formData.name,
                    id_chef: formData.manager,
                    date_debut: formData.startDate,
                    date_fin: formData.deadline,
                    budget: parseFloat(formData.budget),
                    etat: formData.etat,
                    freelancer_id: formData.freelancer,
                    salaire: parseFloat(formData.salaire)
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
                    etat: '',
                    freelancer: '',
                    salaire: ''
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
                        <label>Project Name</label>
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
                            <option value="en cours">On going</option>
                            <option value="terminé">Finished</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Freelancer</label>
                        <select
                            name="freelancer"
                            value={formData.freelancer}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select a freelancer</option>
                            {freelancers.map((freelancer) => (
                                <option key={freelancer.id} value={freelancer.id}>
                                    {freelancer.nom} {freelancer.prenom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Salary</label>
                        <input
                            type="number"
                            name="salaire"
                            value={formData.salaire}
                            onChange={handleChange}
                            placeholder="Enter salary"
                        />
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
