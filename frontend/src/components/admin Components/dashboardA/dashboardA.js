import React, { useEffect, useState } from 'react';
import styles from './dashboardA.module.css';
import { Link } from 'react-router-dom';
import adminPhoto from '../../../admin.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../confirm/confirm'; 

const Dashboard = ({ logout }) => {
  const [projects, setProjects] = useState([]);
  const [financiers, setFinanciers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const navigate = useNavigate();

  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);

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
        console.log('Fetched Projects:', response.data);
        setProjects(response.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
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
        console.log('Fetched Financiers:', response.data);
        setFinanciers(response.data);
      } catch (err) {
        console.error('Error fetching financiers:', err);
      } finally {
        setLoading(false);
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
        console.log('Fetched Managers:', response.data);
        setManagers(response.data);
      } catch (err) {
        console.error('Error fetching managers:', err);
      } finally {
        setLoading(false);
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
        console.log('Fetched Freelancers:', response.data);
        setFreelancers(response.data);
      } catch (err) {
        console.error('Error fetching freelancers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  if (loading) {
    return <p>Loading projects...</p>;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  // Open confirmation modal before deletion
  const openDeleteModal = (projectId) => {
    setProjectIdToDelete(projectId);
    setShowConfirmModal(true);
  };

  const closeDeleteModal = () => {
    setShowConfirmModal(false);
    setProjectIdToDelete(null);
  };

  // Confirm delete function
  const confirmDelete = async () => {
    if (!projectIdToDelete) return;

    try {
      // Delete associated salaries
      await axios.delete(`http://localhost:5000/api/salaire/${projectIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Delete project
      await axios.delete(`http://localhost:5000/api/projects/${projectIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProjects(projects.filter(project => project.id !== projectIdToDelete));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting project and associated salaries:", error);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div className={styles.navbar}>
        <div className={styles.navbarLogo}>
          <h2>MoneyMap</h2>
        </div>
        <div
          className={styles.navbarAdmin}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className={styles.adminText}>Admin</span>
          <img src={adminPhoto} alt="Admin" className={styles.adminPhoto} />

          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <button onClick={logout} className={styles.dropdownButton}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Project List */}
      <div className={styles.allContainer}>
        <div className={styles.projectContainer}>
          <div className={styles.projectHeader}>
            <h3>Project List</h3>
          </div>
          <div className={styles.projectTable}>
            <div className={styles.tableHeader}>
              <p>Project Name</p>
              <p>Status</p>
              <p>Deadline</p>
              <p></p>
              <p></p>
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
  <button className={`${styles.detailsButton}`}>Edit</button>
</Link>

<button className={`${styles.deleteButton}`} onClick={() => openDeleteModal(project.id)}>
  Delete
</button>


                  {showConfirmModal && (
                    <ConfirmModal
                      message="Are you sure you want to delete this project?"
                      onConfirm={confirmDelete}
                      onCancel={closeDeleteModal}
                    />
                  )}
                </div>
              ))
            ) : (
              <p>No projects available</p>
            )}
          </div>
        </div>
        <div className={styles.others}>
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
                      <p key={index}>{financier.nom} {financier.prenom}</p>
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
                      <p key={index}>{manager.nom} {manager.prenom}</p>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyState}>No managers available</p>
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
                      <p key={index}>{freelancer.nom} {freelancer.prenom}</p>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyState}>No freelancers available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
