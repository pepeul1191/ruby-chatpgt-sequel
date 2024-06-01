import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Home from '../pages/app/Home';
import About from '../pages/app/About';
import Contact from '../pages/app/Contact';
import ConversationList from '../pages/app/ConversationList';
import Conversation from '../pages/app/Conversation';
import Conversation2 from '../pages/app/Conversation2';
import MyModalComponent from '../components/MyModalComponent';
import '../assets/css/app.css'; 
import { Container } from 'react-bootstrap';

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isConversationRoute = location.pathname.startsWith('/conversation/');
  
  return (
    <>
      <NavBar />
      <Container className='app-container'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/conversation" element={<ConversationList />} />
        </Routes>
      </Container>
      <Routes>
        <Route path="/conversation/:conversationId" element={<Conversation />} />
      </Routes>
      {!isConversationRoute && <Footer />}
    </>
  );
};

export default App;
