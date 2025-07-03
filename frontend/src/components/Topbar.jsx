import React,{useState,useEffect} from 'react';
import './Topbar.css';
import { FaSearch, FaBell  } from 'react-icons/fa';
import { PiBooksLight } from "react-icons/pi";
import { Button, FormControl, InputGroup, Image } from 'react-bootstrap';
import { FaMoon } from 'react-icons/fa';
import { GoSun } from 'react-icons/go';

const Topbar = () => {
   const [isLightMode, setIsLightMode] = useState(false); // default = night

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);
  return (
    <div className="topbar d-flex align-items-center justify-content-between px-4 py-2 shadow-sm bg-white">
      {/* Left logo */}
      <div className="d-flex align-items-center">
        <div className="logo-icon me-2">
    <PiBooksLight size={40} />
        </div>
<h5 className="m-0 fw-semibold fs-3 mr-5"  >Libris</h5>
      </div>

      {/* Search */}
      <div className="flex-grow-1 mx-4 d-none d-md-block">
        <InputGroup className="search-bar">
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <FormControl placeholder="Seek forgotten texts..." />
        </InputGroup>
      </div>

      {/* Right: Premium + Bell + Avatar */}
      <div className="d-flex align-items-center gap-3">
        <Button className="premium-btn">🌟 Unlock Premium</Button>
        <FaBell className="bell-icon" />
 <button
          onClick={() => setIsLightMode(prev => !prev)}
          className="btn btn-outline-light"
          style={{ color: "var(--text-color)" }}
          title={isLightMode ? "Switch to Night Mode" : "Switch to Day Mode"}
        >
          {isLightMode ? <FaMoon /> : <GoSun />}
        </button>        <Image
          src="https://randomuser.me/api/portraits/women/75.jpg"
          roundedCircle
          width="35"
          height="35"
        />
      

      </div>
    </div>
  );
};

export default Topbar;
