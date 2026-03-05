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

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <img src={logo} alt="KTL Racing Kart" />
        </Link>
        <ul className={`navbar__links${menuOpen ? ' open' : ''}`}>
          <li><Link to="/" className={`navbar__link${isActive('/') ? ' active' : ''}`}>Inicio</Link></li>
          <li><Link to="/productos" className={`navbar__link${isActive('/productos') ? ' active' : ''}`}>Chasis</Link></li>
          <li><Link to="/galeria" className={`navbar__link${isActive('/galeria') ? ' active' : ''}`}>Galería</Link></li>
          <li><Link to="/contacto" className={`navbar__link navbar__cta btn btn-primary${isActive('/contacto') ? ' active' : ''}`}>Contacto</Link></li>
        </ul>
        <button className={`navbar__burger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
