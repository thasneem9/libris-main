import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

import { Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import {
  FaCog,
  FaUser,
  FaRss,
  FaQuoteRight,
  FaGamepad,
  FaBookmark,
  FaSignOutAlt,
} from 'react-icons/fa';
import { TbColorFilter } from 'react-icons/tb';


export default function CustomSidebar({ setShowModal, applyTheme }) {
  const navigate=useNavigate()


  const handleFeedClick=async()=>{
    navigate('/feed')
  }

  const handleUserAccountClick=async()=>{
    navigate('/user')
  }
  const handleQuotesClick=async()=>{
    navigate('/quotes')
  }
  return (
    <Sidebar backgroundColor="#f5fafd" className="d-flex flex-column justify-content-between p-3" style={{ height: '100vh' }}>
      {/* Logo & Top Buttons */}
      <div>
        <h4 className="logo mb-4">📚 Libris</h4>
        <Menu>
          <MenuItem>
            <Button
              variant="primary"
              className="square-pill shadow-sm w-100"
              onClick={()=>navigate('/homepage')}
            >
              Home 
            </Button>
          </MenuItem>
         

        </Menu>
      </div>

      {/* Links */}
      <div className="sidebar-links-wrapper">
        <Menu>
       
       
          <MenuItem icon={<FaUser />}  onClick={() => setShowModal(true)}>Add Book</MenuItem>
          <MenuItem icon={<FaUser />} onClick={handleUserAccountClick}>User Account</MenuItem>
          <MenuItem icon={<FaRss />} onClick={handleFeedClick}>Feed</MenuItem>
          <MenuItem icon={<FaQuoteRight />} onClick={handleQuotesClick} >Quotes</MenuItem>
          <MenuItem icon={<FaBookmark />}>Highlights / Bookmarks</MenuItem>
        </Menu>

        <Button variant="outline-secondary" size="sm" className="mt-3 w-100">
          <FaSignOutAlt className="me-2" />
          Logout
        </Button>
      </div>
    </Sidebar>
  );
}
