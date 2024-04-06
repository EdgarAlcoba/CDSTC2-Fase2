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
        
        <label className='welcome-label'>DocGPT project</label>
        <label className='fist-aid-label'>About us</label>
        
        <label className='info-text'>
        DocGPT arises from the need for quick access to accurate information in medical emergencies.
         It provides guidance on first aid situations and give access to this information in an intuitive 
         and tailored manner for each emergency. With this application, we aim to reduce serious medical complications that 
         may arise from not having the necessary information in time. 
        </label>
        <label className='info-text'>
        However, the system will always recommend seeking 
         professional help in case of a serious emergency or if the user lacks the necessary 
         knowledge to implement the recommendations provided.
        </label>
        
        <label className='fist-aid-label'>Created by</label>
        <label className='creators'>
          <img className='sinco' src={Logo} alt="Sinco" />
          <br></br>
          <ul>
            <li>Edgar Alcoba Casado</li>
            <li>Pablo Morais Álvarez</li>
            <li>Pablo Corral Gutiérrez</li>
            <li>Marcos Sarmiento Álvarez</li>
            <li>Víctor Frutos Martínez Calvo</li>
          </ul>
        </label>
      </div>
    </div>
  )
}


export default Info