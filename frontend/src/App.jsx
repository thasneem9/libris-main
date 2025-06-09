import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PDFViewerPage from './pages/PDFViewerPage';

import Navbar from "./components/Navbar"
import Plank from "./components/Plank"
import Book from "./components/Book"
import Robot from "./components/Robot"

import { SharedS3UrlProvider } from "./contexts/s3urlContext"
import "./app.css"

import { BrowserRouter } from 'react-router-dom';
function App() {


  return (
    <>
      <Router>
     <Navbar/>
   
    <SharedS3UrlProvider>
    <Book />
    <Plank />
    <Robot/>
    </SharedS3UrlProvider>

    
      <Routes>
        <Route path="/" element={<PDFViewerPage />} />
        <Route path="/view-pdf" element={<PDFViewerPage />} />
      </Routes>
    </Router>
  
    </>
  )
}

export default App
