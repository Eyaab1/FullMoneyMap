import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './projectList.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allEndedProjects, setAllEndedProjects] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [heatmapData, setHeatmapData] = useState(null); // Heatmap data
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

        const projectsData = response.data;
        const currentTime = new Date().getTime();
        const updatedProjects = projectsData.map((project) => {
          if (new Date(project.date_fin).getTime() < currentTime && project.etat !== 'Ended') {
            project.etat = 'Ended';
          }
          return project;
        });

        const endedProjects = updatedProjects
          .filter((project) => project.etat === 'Ended')
          .sort((a, b) => new Date(b.date_fin) - new Date(a.date_fin));

        setProjects(updatedProjects);
        setAllEndedProjects(endedProjects);
        generateHeatmapData(updatedProjects);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Function to generate heatmap data
  const generateHeatmapData = (projects) => {
    const statuses = ['Ongoing', 'Ended', 'Paused'];
    const months = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('fr-FR', { month: 'long' })
    );

    const heatmapDataArray = months.map((_, monthIndex) =>
      statuses.map((status) =>
        projects.filter(
          (project) =>
            new Date(project.date_fin).getMonth() === monthIndex &&
            project.etat === status
        ).length
      )
    );

    setHeatmapData({
      statuses,
      months,
      heatmapDataArray,
    });
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }


    return (
      <div className="allContainer">
        <div className="project-list-containerProject">
          <div className="project-header">
            <h3>Project List</h3>
            <div className="project-buttons">

              <button className="add-project-btn" onClick={() => navigate('/addProject')}>
                Add Project
              </button>
            </div>
          </div>
          <div className="project-tableProject">
            <div className="table-headerProject">
              <p>Project Name</p>
              <p>Status</p>
              <p>Project Manager</p>
              <p>Deadline</p>
              <p>Budget</p>
              <p>Details</p>
            </div>
            {projects.filter((project) => project.etat === 'en cours')
             .map((project, index) => (
              <div key={index} className="table-rowProject">
              <p>{project.nom}</p>
              <p className={project.etat === 'en cours' ? 'status ongoing' : 'status'}>On Going</p>
              <p>{project.manager_nom} {project.manager_prenom}</p>
              <p>{new Date(project.date_fin).toLocaleString('fr-FR', {year: 'numeric', month: 'long', day: 'numeric'  })}</p> {/* Correct placement for Deadline */}
              <p>{project.budget ? `${project.budget} dt` : 'N/A'}</p> {/* Correct placement for Budget */}
              <Link to={`/project/${project.id}`}>
                <button className="details-button">Details</button>
              </Link>
            </div>
            
            ))}
          </div>
        </div>
    
        <div className="right-side-container">
          <h4>Ended Projects</h4>
          <ul className="listul">
            {allEndedProjects.slice(0, 3).map((project, index) => (
              <li key={index}>
                <div className="ended-project-card">
                  <p className="ended-project-name">{project.nom}</p>
                  <p className="ended-project-date">{new Date(project.date_fin).toLocaleString('fr-FR', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}</p>
                </div>
              </li>
            ))}
          </ul>
          <button className="view-all-btn2" onClick={() => setShowModal(true)}>View All</button>
        </div>
    
        {showModal && (
  <div className="modalProject">
    <div className="modal-contentProject">
      <span className="close-button1" onClick={() => setShowModal(false)}>&times;</span>
      <h4>All Ended Projects</h4>
      <ul>
        {allEndedProjects.map((project, index) => (
          <li key={index}>
            <div className="ended-project-card">
              <p className="ended-project-name">{project.nom}</p>
              <p className="ended-project-date">
                {new Date(project.date_fin).toLocaleString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {/* Add the Details button here */}
              <Link to={`/project/${project.id}`}>
                <button className="details-button">Details</button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}
    
        {/* Move heatmap here */}
        {/* {heatmapData && (
          <div className="heatmap-container">
            <h3>Heatmap: Projects by Month and Status</h3>
            <Bar
              data={{
                labels: heatmapData.months,
                datasets: heatmapData.statuses.map((status, index) => ({
                  label: status,
                  data: heatmapData.heatmapDataArray.map((row) => row[index]),
                  backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'][index],
                })),
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Projects by Month and Status' },
                },
                scales: {
                  x: { stacked: true },
                  y: { stacked: true, beginAtZero: true },
                },
              }}
            />
          </div>
        )} */}
      </div>
    );
    
};

export default ProjectList;
