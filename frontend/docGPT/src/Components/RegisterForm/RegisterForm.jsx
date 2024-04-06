import React from 'react';
import './RegisterForm.css';
import { FaUser, FaLock } from 'react-icons/fa'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("password") === data.get("repeat-password")) {
      axios
        .post("http://localhost:5000/api/register", {
          username: data.get("username"),
          password: data.get("password"),
        })
        .then(function (response) {
          alert("Register process completed succesfully")
          navigate("/login");
        })
        .catch(function (error) {
          alert(error.response.data);
        });

    } else {
      alert("Las contraseñas no coinciden");
    }
  };

  return (
    <div className='register-container'>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          <div className='input-box'>
            <input type='text' placeholder='Email' name='username' required></input>
            <FaUser className='icon' />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Password' name='password' required></input>
            <FaLock className='icon' />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Repeat password' name='repeat-password' required></input>
            <FaLock className='icon' />
          </div>

          <button type='submit'>Register</button>
        </form>
      </div>
    </div >
  )
}

export default RegisterForm