import React from 'react';
import './Home.css';
import logo from "../assets/a.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className='badadiv'>
        <div className='maincontainer'>
          <div className='leftdiv'>
            <img src={logo} alt="Logo" />
          </div>
          <div className='rightdiv'>
            <p>Discover jobs that match your<br /> skills and passion...</p>
            <button onClick={() => navigate("/jobs")}>Find Jobs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
