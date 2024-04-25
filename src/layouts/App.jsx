import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import MyModalComponent from '../components/MyModalComponent';
import '../assets/css/styles.css'; 

const App = () => (
  <Router>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
    <footer>
      Footer
    </footer>
  </Router>
);

export default App;