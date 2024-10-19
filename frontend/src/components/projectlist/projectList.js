import React, { useEffect, useState } from 'react';
import './projectList.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);    

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects/all'); 
        setProjects(response.data);  
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch projects');
        setLoading(false);
      }
    };
  
    fetchProjects();
  }, []);

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div className="project-list-container">
      <div className="project-table">
        <div className="table-header">
          <p>Project Name</p>
          <p>ID</p>
          <p>Status Indicator</p>
          <p>Project Manager</p>
          <p>Deadline</p>
          <p>Details</p>
        </div>
        {projects.map((project, index) => (
          <div key={index} className="table-row">
            <p>{project.nom}</p> {/* Assuming 'name' is stored as 'nom' */}
            <p>{project.id}</p>
            <p className={project.etat === 'Ongoing' ? 'status ongoing' : 'status'}>
              {project.etat} {/* Assuming 'status' is stored as 'etat' */}
            </p>
            <p>{project.manager}</p> {/* Ensure this matches the database field */}
            <p>{new Date(project.date_fin).toLocaleString('fr-FR', { 
            year: 'numeric', month: 'long', day: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
          })}</p> {/* Assuming 'date_fin' is the field for deadline */}
            <Link to={`/project`}>
              <button className="details-button">Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;