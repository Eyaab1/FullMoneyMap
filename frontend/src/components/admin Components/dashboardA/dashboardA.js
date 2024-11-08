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
  const [error, setError] = useState(null);

  // Fetching projects
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

    fetchProjects();}, []);

    // Fetching financiers
  useEffect(() => {
    const fetchFinanciers = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Unauthorized access - No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/utilisateurs/role/financier', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFinanciers(response.data);
      } catch (err) {
        setError('Failed to fetch financiers');
      }
    };

    fetchFinanciers();
  }, []);

  //fetchin managerss
  useEffect(() => {
    const fetchMangers = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Unauthorized access - No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/utilisateurs/role/chef%20de%20projet', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setManagers(response.data);
      } catch (err) {
        setError('Failed to fetch managers');
      }
    };

    fetchMangers();
  }, []);

  //fetchin freelancers
  useEffect(() => {
    const fetchFreelancers = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Unauthorized access - No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/freelancers/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFreelancers(response.data);
      } catch (err) {
        setError('Failed to fetch freelancers');
      }
    };

    fetchFreelancers();
  }, []);


  

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p>{error}</p>;
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
          {projects.map((project, index) => (
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
          ))}
        </div>
      </div>


        {/* cards */}
        <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span>Financiers</span>
                <div className={styles.headerButtons}>
                  <button className={styles.viewAllButton}>View All</button>
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

          <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span>Project managers</span>
                <div className={styles.headerButtons}>
                  <button className={styles.viewAllButton}>View All</button>
                </div>
              </div>

              <div className={styles.cardText}>
                {financiers.length > 0 ? (
                  <ul className={styles.financierList}>
                    {managers.map((managers, index) => (
                      <li key={index}>{managers.nom} {managers.prenom}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyState}>No managers available</p>
                )}
              </div>
            </div>
          </div>


          <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span>Freelancers</span>
                <div className={styles.headerButtons}>
                  <button className={styles.viewAllButton}>View All</button>
                </div>
              </div>

              <div className={styles.cardText}>
                {financiers.length > 0 ? (
                  <ul className={styles.financierList}>
                    {freelancers.map((freelancers, index) => (
                      <li key={index}>{freelancers.nom} {freelancers.prenom}</li>
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
