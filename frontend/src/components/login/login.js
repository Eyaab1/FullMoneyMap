import React, { useState } from 'react';
import './login.css'; // Import the CSS file

const Login = () => {
  const [loginForm, setLoginForm] = useState({ user: '', pwd: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the login logic here
    console.log('Logging in with:', loginForm);
  };

  return (
    <div className="wrapper bg-white">
      <div className="h4 text-muted text-center pt-2">Enter your login details</div>
      <form className="pt-3" onSubmit={handleSubmit}>
        <div className="form-group py-2">
          <div className="input-field">
            <span className="far fa-user p-2"></span>
            <input
              type="text"
              name="user"
              placeholder="Username or Email Address"
              required
              onChange={handleChange}
              value={loginForm.user}
            />
          </div>
        </div>
        <div className="form-group py-1 pb-2">
          <div className="input-field">
            <span className="fas fa-lock p-2"></span>
            <input
              type="password"
              name="pwd"
              placeholder="Enter your Password"
              required
              onChange={handleChange}
              value={loginForm.pwd}
            />
          </div>
        </div>
        <br/>
        <button type="submit" className="btn btn-block text-center my-3" disabled={!loginForm.user || !loginForm.pwd}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
