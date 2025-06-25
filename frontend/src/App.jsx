import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PDFViewerPage from './pages/PDFViewerPage';
import Home from './components/Home';
import ThemeChooser from './components/ThemeChooser';
import "./app.css"
import Homepage from './components/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';

// wrote to avoid the super-persistent error: container must be absolute forp df-highlighter
const AppWrapper = ({ children }) => (
  <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
    {children}
  </div>
);

function App() {
  return (
    <>
      <Router>
        <AppWrapper>
          <Routes>
            <Route path="/" element={<ThemeChooser />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/fiction" element={<Home />} />
            <Route path="/pdf-viewer" element={<PDFViewerPage />} />
          </Routes>
        </AppWrapper>
      </Router>
    </>
  );
}

export default App;
