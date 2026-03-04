import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-ktl">KTL</span>
          <span className="navbar__logo-kart">KART</span>
        </Link>

        <button
          className={`navbar__burger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span /><span /><span />
        </button>

        <ul className={`navbar__links${menuOpen ? ' open' : ''}`}>
          {[
            { to: '/', label: 'Inicio' },
            { to: '/productos', label: 'Chasis' },
            { to: '/galeria', label: 'Galería' },
            { to: '/contacto', label: 'Contacto' },
          ].map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className={`navbar__link${isActive(to) ? ' active' : ''}`}>{label}</Link>
            </li>
          ))}
          <li>
            <Link to="/contacto" className="btn btn-primary navbar__cta">Consultá ahora</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
