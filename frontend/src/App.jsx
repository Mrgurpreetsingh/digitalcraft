import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import ContactPage from './pages/ContactPage.jsx';
import InscriptionPage from './pages/Inscription.jsx';
import ConnexionPage from './pages/Connexion.jsx';
import DevisPage from './pages/Devis.jsx';
import Profil from './pages/Profil.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/inscription" element={<InscriptionPage />} />
          <Route path="/connexion" element={<ConnexionPage />} />
          <Route path="/devis" element={<DevisPage />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;