import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/LOGO.png';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => setMenuOpen(false), [location]);
  const a = (path) => location.pathname === path;
  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/"><img src={logo} alt="KTL Racing Kart" className="navbar__logo" /></Link>
        <ul className={`navbar__links${menuOpen ? ' open' : ''}`}>
          <li><Link to="/" className={`navbar__link${a('/') ? ' active' : ''}`}>Inicio</Link></li>
          <li><Link to="/productos" className={`navbar__link${a('/productos') ? ' active' : ''}`}>Style 2025</Link></li>
          <li><Link to="/galeria" className={`navbar__link${a('/galeria') ? ' active' : ''}`}>Galería</Link></li>
          <li><Link to="/contacto" className={`navbar__link navbar__cta btn btn-primary${a('/contacto') ? ' active' : ''}`}>Contacto</Link></li>
        </ul>
        <button className={`navbar__burger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span/><span/><span/>
        </button>
      </div>
    </nav>
  );
}
