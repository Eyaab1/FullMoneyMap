import React, { useEffect, useState } from 'react';
import styles from './dashboardA.module.css'; 
import { Link } from 'react-router-dom';
import adminPhoto from '../../../admin.png';  
import axios from 'axios';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [financiers, setFinanciers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching projects
  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/projects/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched Projects:', response.data); // Log to check fetched data
        setProjects(response.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false); // Set loading to false after the fetch attempt
      }
    };

    fetchProjects();
  }, []);

  // Fetching financiers
  useEffect(() => {
    const fetchFinanciers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/utilisateurs/role/financier', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched Financiers:', response.data); // Log to check fetched data
        setFinanciers(response.data);
      } catch (err) {
        console.error('Error fetching financiers:', err);
      } finally {
        setLoading(false); // Set loading to false after the fetch attempt
      }
    };

    fetchFinanciers();
  }, []);

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
      } finally {
        setLoading(false); // Set loading to false after the fetch attempt
      }
    };

    fetchManagers();
  }, []);

  // Fetching freelancers
  useEffect(() => {
    const fetchFreelancers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/freelancers/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched Freelancers:', response.data); // Log to check fetched data
        setFreelancers(response.data);
      } catch (err) {
        console.error('Error fetching freelancers:', err);
      } finally {
        setLoading(false); // Set loading to false after the fetch attempt
      }
    };

    fetchFreelancers();
  }, []);

  if (loading) {
    return <p>Loading projects...</p>; // Or a spinner to indicate loading
  }

  return (
    <div>
      {/* Navbar */}
      <div className={styles.navbar}>
        <div className={styles.navbarLogo}>
          <h2>MoneyMap</h2>
        </div>
        <div className={styles.navbarAdmin}>
          <span className={styles.adminText}>Admin</span>
          <img src={adminPhoto} alt="Admin" className={styles.adminPhoto} />
        </div>
      </div>

      {/* Project List */}
      <div className={styles.projectContainer}>
        <div className={styles.projectHeader}>
          <h3>Project List</h3>
          <div className={styles.headerButtons}>
            <button className={styles.viewAllButton}>View All</button>
          </div>
        </div>
        <div className={styles.projectTable}>
          <div className={styles.tableHeader}>
            <p>Project Name</p>
            <p>Status</p>
            <p>Deadline</p>
            <p>Details</p>
          </div>
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <div key={index} className={styles.tableRow}>
                <p>{project.nom}</p>
                <p className={project.etat === 'Ongoing' ? styles.ongoing : styles.status}>
                  {project.etat}
                </p>
                <p>
                  {new Date(project.date_fin).toLocaleString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <Link to={`/project/${project.id}`}>
                  <button className={styles.detailsButton}>Details</button>
                </Link>
              </div>
            ))
          ) : (
            <p>No projects available</p>
          )}
        </div>
      </div>

      {/* Financiers Card */}
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Financiers</span>
            <div className={styles.headerButtons}>
              <Link to={`/financial`}>
                <button className={styles.viewAllButton}>View All</button>
              </Link>
            </div>
          </div>

          <div className={styles.cardText}>
            {financiers.length > 0 ? (
              <ul className={styles.financierList}>
                {financiers.map((financier, index) => (
                  <li key={index}>{financier.nom} {financier.prenom}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyState}>No financiers available</p>
            )}
          </div>
        </div>
      </div>

      {/* Project Managers Card */}
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Project Managers</span>
            <div className={styles.headerButtons}>
            <Link to={`/managers`}>
              <button className={styles.viewAllButton}>View All</button>
              </Link>
            </div>
          </div>

          <div className={styles.cardText}>
            {managers.length > 0 ? (
              <ul className={styles.financierList}>
                {managers.map((manager, index) => (
                  <li key={index}>{manager.nom} {manager.prenom}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyState}>No project managers available</p>
            )}
          </div>
        </div>
      </div>

      {/* Freelancers Card */}
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Freelancers</span>
            <div className={styles.headerButtons}>
            <Link to={`/freelancers`}>
              <button className={styles.viewAllButton}>View All</button>
              </Link>
            </div>
          </div>

          <div className={styles.cardText}>
            {freelancers.length > 0 ? (
              <ul className={styles.financierList}>
                {freelancers.map((freelancer, index) => (
                  <li key={index}>{freelancer.nom} {freelancer.prenom}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyState}>No freelancers available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
