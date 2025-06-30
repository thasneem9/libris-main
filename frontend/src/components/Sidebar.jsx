import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

import { Button, Dropdown } from 'react-bootstrap';
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
  return (
    <Sidebar backgroundColor="#f5fafd" className="d-flex flex-column justify-content-between p-3" style={{ height: '100vh' }}>
      {/* Logo & Top Buttons */}
      <div>
        <h4 className="logo mb-4">📚 Libris</h4>
        <Menu>
          <MenuItem>
            <Button
              variant="primary"
              className="rounded-pill shadow-sm w-100"
              onClick={() => setShowModal(true)}
            >
              Add Book ❄️
            </Button>
          </MenuItem>

          <MenuItem>
            <Dropdown className="w-100">
              <Dropdown.Toggle variant="outline-primary" className="rounded-pill w-100">
                <TbColorFilter size={20} className="me-2" /> Themes
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => applyTheme('frosty')}>❄️ Frosty</Dropdown.Item>
                <Dropdown.Item onClick={() => applyTheme('coffee')}>☕ Coffee</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </MenuItem>
        </Menu>
      </div>

      {/* Links */}
      <div className="sidebar-links-wrapper">
        <Menu>
          <MenuItem icon={<FaCog />}>Settings</MenuItem>
          <MenuItem icon={<FaUser />}>User Account</MenuItem>
          <MenuItem icon={<FaRss />}>Feed</MenuItem>
          <MenuItem icon={<FaQuoteRight />}>Quotes</MenuItem>
          <MenuItem icon={<FaGamepad />}>Game</MenuItem>
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
