import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCog,
  FaUser,
  FaRss,
  FaQuoteRight,
  FaGamepad,
  FaBookmark,
  FaSignOutAlt,
  FaBookOpen 
} from 'react-icons/fa';
import { LuLibraryBig } from "react-icons/lu";

import { GoCommentDiscussion } from "react-icons/go";
import { TbColorFilter } from 'react-icons/tb';
import { useSetRecoilState } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import api from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { FiBook } from "react-icons/fi";
import { LuPanelLeft } from "react-icons/lu";

export default function CustomSidebar({ setShowModal }) {
  const navigate=useNavigate()

const setUser = useSetRecoilState(userAtom);
  const [showLogoutModal, setLogoutShowModal] = useState(false);
  const handleFeedClick=async()=>{
    navigate('/feed')
  }

  const handleUserAccountClick=async()=>{
    navigate('/user')
  }
  const handleQuotesClick=async()=>{
    navigate('/quotes')
  }
  const handleConfirmLogout = async () => {
    try {
      await api.post('/users/logout', {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem('libris-user');
      toast.success('Logged out!');
      navigate('/auth');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Logout failed.');
    } finally {
      setLogoutShowModal(false); // Close modal
    }
  };
  return (
    <>
    <Sidebar backgroundColor="#f5fafd" className="d-flex flex-column justify-content-between p-3" style={{ height: '100vh' }}>
      {/* Logo & Top Buttons */}
      <div>
        <div className='d-flex  justify-content-between'> 
        <h4 className="logo mb-4">📚 Libris</h4>
        <LuPanelLeft />
        </div>

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
       
       
          <MenuItem icon={<FiBook  />}  onClick={() => setShowModal(true)}>Add Book</MenuItem>
          <MenuItem icon={<FaUser />} onClick={handleUserAccountClick}>User Account</MenuItem>
          <MenuItem icon={<GoCommentDiscussion  size={16}  />} onClick={handleFeedClick}>Discussion</MenuItem>
          <MenuItem icon={<FaBookOpen  />} onClick={handleFeedClick}>Reading Journal</MenuItem>
          <MenuItem icon={<FaQuoteRight />} onClick={handleQuotesClick} >Highlights/Quotes</MenuItem>
          <MenuItem icon={<LuLibraryBig />} onClick={handleQuotesClick} >Free Ebooks Library</MenuItem>

        </Menu>

        <Button variant="outline-secondary" size="sm" className="mt-3 w-100" onClick={() => setLogoutShowModal(true)}>
          <FaSignOutAlt className="me-2" />
          Logout
        </Button>
      </div>
    </Sidebar>

    {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={() => setLogoutShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to log out? We'll miss you!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setLogoutShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            Yes, Log me out
          </Button>
        </Modal.Footer>
      </Modal>
      </>
  );
}
