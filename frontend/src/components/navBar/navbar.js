import React, { useState, useEffect } from 'react';
import styles from './navbar.module.css';
import adminPhoto from '../../admin.png';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Function to check and reset notifications for a new day
  const checkAndResetNotifications = () => {
    const lastViewedDate = localStorage.getItem('lastViewedDate');
    const todayDate = new Date().toISOString().split('T')[0];

    if (lastViewedDate !== todayDate) {
      setUnreadNotifications(true);
      localStorage.setItem('lastViewedDate', todayDate);
    }
  };

  useEffect(() => {
    // Fetch notifications when the component mounts
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      if (token && user) {
        try {
          const response = await fetch('http://localhost:5000/api/projects/all', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const projects = await response.json();

            // Get current date and date for yesterday
            const today = new Date();
            const todayDate = today.toISOString().split('T')[0];
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const yesterdayDate = yesterday.toISOString().split('T')[0];

            // Filter projects where the deadline is today or yesterday
            const relevantNotifications = projects.filter((project) => {
              const projectDate = new Date(project.date_fin).toISOString().split('T')[0];
              return projectDate === todayDate || projectDate === yesterdayDate;
            });

            
            setNotifications(relevantNotifications);

            // Check if notifications need resetting
            checkAndResetNotifications();
          } else {
            console.error('Failed to fetch projects:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [user]);

  // Function to handle viewing notifications
  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    if (unreadNotifications) {
      setUnreadNotifications(false); // Mark notifications as read
    }
  };

  if (!user) {
    return <p>Please log in to access the dashboard.</p>;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <button onClick={() => navigate(-1)} className={styles.goBackButton}>
          ←
        </button>
        <h2>MoneyMap</h2>
      </div>
      <ul className={styles.navbarLinks}>
        <li className={styles.notification}>
          <button
            className={styles.notificationButton}
            onClick={handleNotificationClick}
          >
            🔔
            {unreadNotifications && notifications.length > 0 && (
              <span className={styles.notificationCount}>{notifications.length}</span>
            )}
          </button>
          {showNotifications && (
            <div className={styles.notificationDropdown}>
              <h4>Notifications</h4>
              <ul >
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <li><p key={index}>
                    <strong>{notification.nom}</strong> is due today.
                  </p></li>
                ))
                
              )
               : (
                <p>No notifications</p>
              )}
              </ul>
            </div>
          )}
        </li>
        <li className={styles.profile}>
          <img src={adminPhoto} alt="Profile Icon" className={styles.profileImage} />
          <span className={styles.username}>
            {user.nom} {user.prenom}
            <br />
            <span className={styles.role}>{user.role}</span>
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
