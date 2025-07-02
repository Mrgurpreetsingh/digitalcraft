import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services'; // Importe la nouvelle page
import Footer from './components/Footer';
// Supprime temporairement FaFacebook et FaLinkedin s'ils ne sont pas utilisés
// import { FaFacebook, FaLinkedin } from 'react-icons/fa'; (commenté pour l'instant)

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} /> {/* Nouvelle route */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;