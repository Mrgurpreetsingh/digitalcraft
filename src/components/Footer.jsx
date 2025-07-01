import React from 'react';
import '../App.css';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer style={{ padding: '20px', backgroundColor: '#4B5563', color: '#FFFFFF', textAlign: 'center' }}>
      <p>
        Contact | <a href="#" style={{ color: '#FFFFFF', textDecoration: 'none' }}><FaFacebook /></a> | 
        <a href="#" style={{ color: '#FFFFFF', textDecoration: 'none' }}><FaLinkedin /></a> | © 2025 DigitalCraft
      </p>
    </footer>
  );
}

export default Footer;