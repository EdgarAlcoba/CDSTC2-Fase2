import React from 'react';
import './RegisterForm.css';
import { FaUser, FaLock } from 'react-icons/fa'

const RegisterForm = () => {
  return (
    <div className='register-container'>
      <div className='wrapper'>
        <form action="">
          <h1>Register</h1>
          <div className='input-box'>
            <input type='text' placeholder='Email' required></input>
            <FaUser className='icon' />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Password' required></input>
            <FaLock className='icon' />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Repeat password' required></input>
            <FaLock className='icon' />
          </div>

          <button type='submit'>Register</button>
        </form>
      </div>
    </div >
  )
}

export default RegisterForm