import React from 'react'
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'
import './Info.css'
import Logo from '../Assets/SincoLogo.svg';

const Info = () => {
  return (
    <div className='info-container'>
      <Navbar />
      <div className='info-body'>
        <label className='welcome-label'>Welcome to DocGPT</label>
        <label className='fist-aid-label'>Your smart first aid assistant</label>
        <img src={Logo} alt="Sinco" />
        <p>Cosas...</p>
      </div>
    </div>
  )
}

export default Info