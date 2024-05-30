import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
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

const App = () => (
  <Router>
    <NavBar />
    <Container>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/conversation" element={<ConversationList />} />
        <Route path="/conversation/:conversationId" element={<Conversation />} />
      </Routes>
    </Container>
    <Footer />
  </Router>
);

export default App;