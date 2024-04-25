import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Home from '../pages/app/Home';
import About from '../pages/app/About';
import Contact from '../pages/app/Contact';
import Conversation from '../pages/app/Conversation';
import MyModalComponent from '../components/MyModalComponent';
import '../assets/css/styles.css'; 

const App = () => (
  <Router>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/conversation" element={<Conversation />} />
    </Routes>
    <Footer />
  </Router>
);

export default App;