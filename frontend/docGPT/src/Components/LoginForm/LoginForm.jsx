import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';

const LoginForm = () => {
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios
      .post("http://localhost:5000/api/login", {
        username: data.get("username"),
        password: data.get("password"),
      })
      .then(function (response) {
        navigate("/chat/" + response.data);
      })
      .catch(function (error) {
        alert(error.response.data);
      });
  };

  return (
    <div className='login-container'>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className='input-box'>
            <input type='text' placeholder='Email' name='username' required></input>
            <FaUser className='icon' />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Password' name='password' required></input>
            <FaLock className='icon' />
          </div>

          <button type='submit'>Login</button>
          <div className="register-link">
            <p>Don't have an account? <Link to="/register">Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm