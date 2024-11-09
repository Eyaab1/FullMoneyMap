import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; 

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
        onLogin(loginForm,navigate); 
        
          // navigate('/dashboard'); 
       
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
    <div className="wrapper bg-white">
      <div className="h4 text-muted text-center pt-2">Enter your login details</div>
      <form className="pt-3" onSubmit={handleSubmit}>
        <div className="form-group py-2">
          <div className="input-field">
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
        <div className="form-group py-1 pb-2">
          <div className="input-field">
            <span className="fas fa-lock p-2"></span>
            <input
                type="password"
                name="password"
                placeholder="Enter your Password"
                required
                aria-label="Password"
                onChange={handleChange}
                value={loginForm.password}
              />
          </div>
        </div>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}
        <br />
        <button 
          type="submit" 
          className="btn btn-block text-center my-3" 
          disabled={!loginForm.email || !loginForm.password || loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
