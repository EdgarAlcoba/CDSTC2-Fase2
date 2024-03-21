import React from 'react'
import Navbar from './Navbar'
import './Home.css'
import videoBG from '../Assets/HomeBackground.mp4'
import Logo from '../Assets/docGPTLogo.svg';

const Home = () => {
  return (
    <div className='home-container'>
      <Navbar />
      <video src={videoBG} autoPlay loop muted />
      <div className='home-body'>
        <label className='welcome-label'>Welcome to DocGPT</label>
        <label className='fist-aid-label'>Your smart first aid assistant</label>
        <a href='/login'>
          <button className='home-start-button'>Get started</button>
        </a>
      </div>
    </div>
  )
}

export default Home