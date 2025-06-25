import react,{useEffect} from 'react'
import './themechooser.css'
import { useNavigate } from 'react-router-dom';
const ThemeChooser=()=>{

useEffect(()=>{
    document.body.classList.add('theme-chooser-bg');
    return () => document.body.classList.remove('theme-chooser-bg');
  },[]);
const navigate=useNavigate()
  const handleAllBooks=()=>{
    navigate("/homepage")

  }

  const handleFiction=()=>{
     navigate("/fiction")
  }
    return(

        <>
      
  <h1>What Are You Reading?</h1>
  <div className="profile-container">
    <div className="profile" onClick={handleAllBooks}>
      <div className="avatar thasneem">😊</div>
      <div className="name">All Books</div>
    </div>
    <div className="profile" onClick={handleFiction}>
      <div className="avatar afnan">😊</div>
      <div className="name">Fiction</div>
    </div>
    <div className="profile">
      <div className="avatar arya">😊</div>
      <div className="name">Textbooks</div>
    </div>
    <div className="profile">
      <div className="avatar children"></div>
      <div className="name">Children</div>
    </div>
    <div className="profile">
      <div className="add-profile">+</div>
      <div className="name">Add New Section</div>
    </div>
  </div>
  <button className="manage-btn">Manage Sections</button>

        </>
    )
}

export default ThemeChooser