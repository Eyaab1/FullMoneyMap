import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './selectedProject.css';  
import axios from 'axios';


const SelectedProject = () => {
  const { id } = useParams(); 
  const [project, setProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



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
        console.log(response.data)
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch projects');
        setLoading(false);
      }
    };

    fetchProject();}, [id]);

  return (
    <div className="selected-project">
      {/* Project Header */}
      <div className="project-header">
        <div className="project-name">
          <h2>Project's Name</h2>
          <h3>{project.nom}</h3>  
        </div>
        <div className="project-budget">
          <h2>Budget</h2>
          <h3>{project.budget}</h3>
        </div>
      </div>

      {/* Project Details */}
      <div className="project-details">
        <div className="details-left">
          <div className="detail-item">
            <label>Project Manager</label>
            {/* <p>{project.manager}</p> */}
          </div>
          <div className="detail-item">
  <label>Start Date</label>
  <p>{project.date_debut ? new Date(project.date_debut).toISOString().split('T')[0] : 'N/A'}</p>
</div>
        </div>

        <div className="details-right">
          <div className="detail-item"> 
            <label>State</label>
            <p>{project.etat}</p>
            
          </div>
          <div className="detail-item">
  <label>Deadline</label>
  <p>{project.date_fin ? new Date(project.date_fin).toISOString().split('T')[0] : 'N/A'}</p>
</div>

        </div>
      </div>

    {/* //   <div className="team-details">
    //     <h3>Team Members</h3>
    //     {project.team.map((member, index) => ( */}
    {/* //       <div key={index} className="team-member">
    //         <span>{member.name}</span>
    //         <span>{member.role}</span>
    //         <span>{member.salary}</span>
    //       </div>
    //     ))}
    //   </div> */}

     <button className="modify-button">Modify</button>
    </div>
  );
};

export default SelectedProject;
