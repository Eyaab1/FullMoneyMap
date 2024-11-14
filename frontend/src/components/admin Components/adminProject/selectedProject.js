import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './selectedProject.css';  
import axios from 'axios';

const SelectedProject = () => {
  const { id } = useParams(); 
  const [managers, setManagers] = useState([]);
  const [project, setProject] = useState({});
  const [freelancer, setFreelancer] = useState([]);
  const [allFreelancers, setAllFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showAddFreelancerModal, setShowAddFreelancerModal] = useState(false);
const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState('');
  const [salary, setSalary] = useState('');
  const [editedProject, setEditedProject] = useState(project); 


  const handleSalaryChange = (e, index) => {
    const updatedFreelancers = [...freelancer];
    updatedFreelancers[index].salary = e.target.value;
    setFreelancer(updatedFreelancers);
  };

  //fetching projects
  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem('token'); 
      if (!token) {
        setError('Unauthorized access - No token found');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/projects/projetWithManager/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setProject(response.data);
        setEditedProject(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch projects');
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);


  
  // Fetching managers
  useEffect(() => {
    const fetchManagers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/utilisateurs/role/chef%20de%20projet', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched Managers:', response.data); // Log to check fetched data
        setManagers(response.data);
      } catch (err) {
        console.error('Error fetching managers:', err);
        setError('Failed to fetch managers');
      } finally {
        setLoading(false); // Set loading to false after the fetch attempt
      }
    };
    fetchManagers();
  }, []);

  // Fetch freelancers associated with this project
  useEffect(() => {
    const fetchFreelancers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized access - No token found');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/freelancers/projects/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setFreelancer(response.data);
      } catch (err) {
        setError('Failed to fetch project freelancers');
      } finally {
        setLoading(false);
      }
    };
  
    fetchFreelancers();
  }, [id]);
  
  // Fetch all freelancers from the database
  useEffect(() => {
    const fetchAllFreelancers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized access - No token found');
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/api/freelancers/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setAllFreelancers(response.data);
      } catch (err) {
        setError('Failed to fetch all freelancers');
      }
    };
  
    fetchAllFreelancers();
  }, []);
  
// Filter freelancers not already working on the project
const filterAvailableFreelancers = () => {
  const currentFreelancerIds = freelancer.map(f => f.id);
  return allFreelancers.filter(f => !currentFreelancerIds.includes(f.id));
};

// Open modal for adding a freelancer
const handleShowAddFreelancerModal = () => {
  // Update the list of freelancers who are not already on the project
  setFilteredFreelancers(filterAvailableFreelancers());
  setShowAddFreelancerModal(true);
};

// Add a freelancer to the project
const handleAddFreelancer = async () => {
  if (selectedFreelancer && salary) {
    const newFreelancer = allFreelancers.find(f => f.id === parseInt(selectedFreelancer));
    if (newFreelancer) {
      // Prepare the data to send to the backend
      const data = {
        id_freelancer: newFreelancer.id,
        id_projet: id, // Assuming `id` is the project ID from useParams
        salaire: salary,
      };

      try {
        // Make a POST request to add the freelancer's salary to the database
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/api/salaires/add', data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 201) {
          // Successfully added freelancer to the salaire table
          // Add the freelancer to the local state
          setFreelancer([...freelancer, { ...newFreelancer, salaire: salary }]);
          setShowAddFreelancerModal(false);
          setSelectedFreelancer(''); // Reset selected freelancer
          setSalary(''); // Reset salary
        }
      } catch (err) {
        setError('Failed to add freelancer salary');
        console.error('Error adding freelancer salary:', err);
      }
    }
  } else {
    alert('Please select a freelancer and enter a salary');
  }
};


useEffect(() => {
  setEditedProject(project); 
}, [project]);



const toggleEditMode = () => {
  if (editMode) {
    updateProject();
  } else {
    setEditMode(!editMode);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  const updateProject = async () => {
    const token = localStorage.getItem('token');
    
    // Check for authorization
    if (!token) {
      setError('Unauthorized access - No token found');
      return;
    }
  
    const { project_name, budget, date_debut, date_fin, etat, manager_id } = editedProject;
  
    // Make sure all required fields are present
    if (!project_name || !budget || !date_debut || !date_fin || !etat || !manager_id) {
      setError('All fields are required');
      return;
    }
  
    try {
      // Send PUT request to update project
      const response = await axios.put(
        `http://localhost:5000/api/projects/projets/${id}`,  // Make sure 'id' is the correct project ID
        {
          method: 'PUT',
          nom: project_name,
          date_debut,
          date_fin,
          budget,
          etat,
          id_chef: manager_id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        // Update project state
        setProject(response.data);
        setEditedProject(response.data); // Update the state with the latest project data
        setEditMode(false); // Exit edit mode
        console.log('Project updated successfully:', response.data);
      } else {
        setError('Failed to update project');
      }
  
    } catch (err) {
      // More detailed error handling
      if (err.response) {
        setError(`Error: ${err.response.data.error || 'Failed to update project'}`);
        console.error('Error response:', err.response.data);
      } else {
        setError('Network error');
        console.error('Error:', err);
      }
    }
  };
  

  

  return (
    <div className="selected-project">
      <div className="project-header">
        <div className="project-name">
          <h2>Project's Name</h2>
          {editMode ? (
            <input
              type="text"
              name="project_name"
              value={editedProject.project_name}
              onChange={handleInputChange}
            />
          ) : (
            <p>{project.project_name}</p>
          )}
        </div>
        <div className="project-budget">
          <h2>Budget</h2>
          {editMode ? (
            <input
              type="number"
              name="budget"
              value={editedProject.budget}
              onChange={handleInputChange}
            />
          ) : (
            <p>{project.budget}</p>
          )}
        </div>
      </div>

      {/* Editable Project Details */}
      <div className="project-details">
        <div className="details-left">
        <div className="detail-item">
            <label>Project Manager</label>
            {editMode ? (
              <select
                name="manager_id"
                value={editedProject.manager_id || ''}
                onChange={handleInputChange}
              >
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.prenom} {manager.nom}
                  </option>
                ))}
              </select>
            ) : (
              <p>{project.manager_nom} {project.manager_prenom}</p> // Display as text when not editing
            )}
          </div>
          <div className="detail-item">
  <label>Start Date</label>
  {editMode ? (
    <input
      type="date"
      name="date_debut"
      value={editedProject.date_debut ? new Date(editedProject.date_debut).toISOString().split('T')[0] : ''}
      onChange={handleInputChange}
    />
  ) : (
    <p>{project.date_debut ? new Date(project.date_debut).toISOString().split('T')[0] : 'N/A'}</p>
  )}
</div>

        </div>

        <div className="details-right">
        <div className="detail-item">
            <label>State</label>
            {editMode ? (
              <select
                name="etat"
                value={editedProject.etat}
                onChange={handleInputChange}
              >
                <option value="en cours">En cours</option>
                <option value="terminé">Terminé</option>
              </select>
            ) : (
              <p>{project.etat}</p> // Show the state as text if not in edit mode
            )}
          </div>
          <div className="detail-item">
  <label>Deadline</label>
  {editMode ? (
    <input
      type="date"
      name="date_fin"
      value={editedProject.date_fin ? new Date(editedProject.date_fin).toISOString().split('T')[0] : ''}
      onChange={handleInputChange}
    />
  ) : (
    <p>{project.date_fin ? new Date(project.date_fin).toISOString().split('T')[0] : 'N/A'}</p>
  )}
</div>

        </div>
      </div>

      {/* Team Members Section */}
      <div className="team-details">
        <div className="team-header">
          <h3>Team Members</h3>
          {editMode && (
            <span className="add-member" onClick={handleShowAddFreelancerModal}>+</span>
          )}
        </div>
        
        <div className="team-member">
          <label>Full name</label>
          <label>Specialty</label>
          <label>Salary</label>
        </div>
        {freelancer.map((freelancer, index) => (
          <div key={index} className="team-member">
            <span>{freelancer.prenom} {freelancer.nom}</span>
            <span>{freelancer.specialty}</span>
            {editMode ? (
              <input
                type="number"
                name={`salary-${index}`}
                value={freelancer.salary}
                onChange={(e) => handleSalaryChange(e, index)}
                className="salary-input"
              />
            ) : (
              <span>{freelancer.salary} DT</span>
            )}
          </div>
        ))}
      </div>

      {/* Modal for adding freelancer */}
      {showAddFreelancerModal && (
  <div className="modal">
    <div className="modal-content">
      <h3>Add Freelancer</h3>
      <select
        value={selectedFreelancer}
        onChange={(e) => setSelectedFreelancer(e.target.value)}
      >
        <option value="">Select Freelancer</option>
        {filteredFreelancers.map((freelancer) => (
          <option key={freelancer.id} value={freelancer.id}>
            {freelancer.prenom} {freelancer.nom}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Enter salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
      />
      <div className="button-container">
        <button className="modify-button" onClick={handleAddFreelancer}>
          Add
        </button>
        <button
          className="modify-button delete-button"
          onClick={() => setShowAddFreelancerModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      
      {/* Edit and Delete Buttons */}
      <div className="button-container">
        <button className="modify-button" onClick={toggleEditMode}>
          {editMode ? "Save" : "Edit"}
        </button>
        
      </div>

      
    </div>
  );
};

export default SelectedProject;
