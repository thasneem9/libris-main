import React from 'react';
import './Topbar.css';
import { FaSearch, FaBell } from 'react-icons/fa';
import { Button, FormControl, InputGroup, Image } from 'react-bootstrap';

const Topbar = () => {
  return (
    <div className="topbar d-flex align-items-center justify-content-between px-4 py-2 shadow-sm bg-white">
      {/* Left logo */}
      <div className="d-flex align-items-center">
        <div className="logo-icon me-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/OOjs_UI_icon_book.svg/2048px-OOjs_UI_icon_book.svg.png" alt="logo" />
        </div>
        <h5 className="m-0 fw-semibold">Libris</h5>
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
        <Image
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
