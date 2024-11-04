import React, { useEffect, useState } from 'react';
import './projectList.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Unauthorized access - No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/projects/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
      <div className="project-header">
        <h3>Project List</h3>
        <div className="project-buttons">
          <button className="view-all-btn">View All</button>
          <button className="add-project-btn" onClick={() => navigate('/addProject')}>
            Add Project
          </button>
        </div>
      </div>
      <div className="project-table">
        <div className="table-header">
          <p>Project Name</p>
          <p>ID</p>
          <p>Status</p>
          <p>Project Manager</p>
          <p>Deadline</p>
          <p>Details</p>
        </div>
        {projects.map((project, index) => (
          <div key={index} className="table-row">
            <p>{project.nom}</p>
            <p>{project.id}</p>
            <p className={project.etat === 'Ongoing' ? 'status ongoing' : 'status'}>
              {project.etat}
            </p>
            <p>{project.manager_nom} {project.manager_prenom}</p>
            <p>{new Date(project.date_fin).toLocaleString('fr-FR', { 
              year: 'numeric', month: 'long', day: 'numeric', 
              hour: '2-digit', minute: '2-digit' 
            })}</p>
            <Link to={`/project/${project.id}`}>
              <button className="details-button">Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
