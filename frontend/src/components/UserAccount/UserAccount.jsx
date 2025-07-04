import React from 'react';
import './useraccount.css';
import profilePic from '../../images/book1.png'; // Replace with actual image or avatar logic
import Topbar from '../Topbar'
export default function UserAccount() {
  return (<>
  <Topbar/>
    <div className="user-account-container">
      <aside className="sidebar">
        <ul>
          <li className="active">My Profile</li>
          <li>My Posts</li>
          <li>Notifications</li>
          <li>Payment and Billing</li>
          <li>Delete Account</li>
          <li>Home</li>
        </ul>
      </aside>

      <main className="profile-section">
        <div className="profile-card">
          <img src={profilePic} alt="Profile" className="avatar" />
          <div className="profile-info">
            <h2>Jack Adams</h2>
            <p className="role">Product Designer</p>
            <p className="location">Los Angeles, California, USA</p>
          </div>
          <button className="edit-button">Edit</button>
        </div>

        <div className="info-card">
          <div className="info-header">
            <h3>Personal Information</h3>
           <button className="edit-button-secondary">Edit</button>

          </div>

          <div className="info-grid">
            <div>
              <label>First Name</label>
              <p>Jack</p>
            </div>
            <div>
              <label>Last Name</label>
              <p>Adams</p>
            </div>
            <div>
              <label>Email address</label>
              <p>jackadams@gmail.com</p>
            </div>
            <div>
              <label>Phone</label>
              <p>(213) 555-1234</p>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
