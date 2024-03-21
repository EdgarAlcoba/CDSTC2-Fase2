import React from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from 'react-icons/fa'

const LoginForm = () => {
  return (
    <div className='login-container'>
      <div className='wrapper'>
        <form action="">
          <h1>Login</h1>
          <div className='input-box'>
            <input type='text' placeholder='Email' required></input>
            <FaUser className='icon' />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Password' required></input>
            <FaLock className='icon' />
          </div>

          <button type='submit'>Login</button>
          <div className="register-link">
            <p>Don't have an account? <a href="/register">Register</a></p>

          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm