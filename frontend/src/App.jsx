import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';

import PDFViewerPage from './pages/PDFViewerPage';
import Home from './components/Home';
import ThemeChooser from './components/ThemeChooser';
import "./app.css"
import Homepage from './components/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthPage from './pages/AuthPage.jsx';
import { userAtom } from './atoms/userAtom.js';
import FeedPage from './components/Feed/FeedPage.jsx';
import UserAccount from './components/UserAccount/UserAccount.jsx';
import Quotes from './components/Quotes/Quotes.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// wrote to avoid the super-persistent error: container must be absolute forp df-highlighter
const AppWrapper = ({ children }) => (
  <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
    {children}
  </div>
);

function App() {
    const user = useRecoilValue(userAtom);

  return (
    <>
     
      <Router>
        <AppWrapper>
          <Routes>
       {/*      <Route path="/" element={<ThemeChooser />} /> */}
       <Route path="/" element={user ? <ThemeChooser /> : <Navigate to="/auth" replace />}/>
        <Route path="/auth" element={ <AuthPage /> }/>
    <Route path="*" element={<Navigate to={user ? '/' : '/auth'} replace />}/>
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/fiction" element={<Home />} />
            <Route path="/pdf-viewer" element={<PDFViewerPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/user" element={<UserAccount />} />
            <Route path="/quotes" element={<  Quotes />} />
          </Routes>
        </AppWrapper>
           <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    
    </>
  );
}

export default App;
