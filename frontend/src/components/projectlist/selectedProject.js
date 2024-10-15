import React from 'react';
import './selectedProject.css';  // Importing the CSS

const SelectedProject = () => {
  const project = {
    name: "INNOVO",
    budget: "35.000 dt",
    manager: "Abdellaoui Eya",
    startDate: "21/07/2023",
    deadline: "29/10/2024",
    state: "Ongoing",
    team: [
      { name: "Dahmeni Aram El Molk", role: "BackEnd Developer", salary: "3000 dt" },
      { name: "Attouani Anis", role: "FrontEnd Developer", salary: "3000 dt" },
      { name: "Mouelhi Taleb", role: "Designer", salary: "2500 dt" }
    ]
  };

  return (
    <div className="selected-project">
      {/* Project Header */}
      <div className="project-header">
        <div className="project-name">
          <h2>Project's Name</h2>
          <h3>{project.name}</h3>
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
            <p>{project.manager}</p>
          </div>
          <div className="detail-item">
            <label>Start Date</label>
            <p>{project.startDate}</p>
          </div>
        </div>

        <div className="details-right">
          <div className="detail-item">
            <label>Deadline</label>
            <p>{project.deadline}</p>
          </div>
          <div className="detail-item">
            <label>State</label>
            <select value={project.state}>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="team-details">
        <h3>Team Members</h3>
        {project.team.map((member, index) => (
          <div key={index} className="team-member">
            <span>{member.name}</span>
            <span>{member.role}</span>
            <span>{member.salary}</span>
          </div>
        ))}
      </div>

      <button className="modify-button">Modify</button>
    </div>
  );
};

export default SelectedProject;
