
import React from 'react';
import './navbar.module.css'; 
import styles from './navbar.module.css'
import adminPhoto from '../../admin.png';  
import { useNavigate } from 'react-router-dom';
const NavBar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    if (!user) {
      console.error('User not found in localStorage');
      return;
    }
    const capitalizeFirstLetter = (name) => {
        if (!name) return '';
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      };

      const handleGoBack = () => {
        navigate(-1); 
      };
    
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
      <button onClick={handleGoBack} className={styles.goBackButton}>← </button>
        <h2>MoneyMap</h2>
      </div>
      <ul className={styles.navbarLinks}>
        
        <li className={styles.profile}>
          
          
              <img src={adminPhoto} alt="Profile Icon" className={styles.profileImage} />
           
        
              <span className={styles.username}>
            {capitalizeFirstLetter(user.nom)} {capitalizeFirstLetter(user.prenom)}<br></br>
            <span className={styles.role}>{user.role}</span>
          </span>

        </li>
        
      </ul>
    </nav>
  );
};

export default NavBar;
