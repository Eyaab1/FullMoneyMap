import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css'; 
import back4 from '../../images/back4.jpg'
const Login = ({ onLogin }) => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
    setErrorMessage(''); 
    setSuccessMessage(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true); 

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage('Login successful!');
        console.log('User data:', data);
        onLogin(loginForm, navigate); 
      } else {
        const errorData = await response.json(); 
        setErrorMessage(errorData.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred during login. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <body>
    <div className={styles.loginContainer}>
      <div className={styles.loginFormSection}>
        <div className={styles.formWrapper}>
          <h4 className="text-muted text-center pt-2">Login </h4>
          <form className="pt-3" onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <div className={styles.inputField}>
                <span className="far fa-user p-2"></span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  aria-label="Email Address"
                  onChange={handleChange}
                  value={loginForm.email}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <div className={styles.inputField}>
                <span className="fas fa-lock p-2"></span>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  aria-label="Password"
                  onChange={handleChange}
                  value={loginForm.password}
                />
              </div>
            </div>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={!loginForm.email || !loginForm.password || loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
          </form>
        </div>
      </div>
      
      <div className={styles.infoSection}>
  <img src={back4} alt="Orders" className={styles.infoImage} />
  <div className={styles.infoContent}>
    
  </div>
</div>

    </div>
    </body>
  );
};

export default Login;
