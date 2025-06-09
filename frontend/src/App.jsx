import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PDFViewerPage from './pages/PDFViewerPage';
import Home from './components/Home';

import "./app.css"

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
            <Route path="/" element={<Home />} />
            <Route path="/pdf-viewer" element={<PDFViewerPage />} />
          </Routes>
        </AppWrapper>
      </Router>
    </>
  );
}

export default App;
