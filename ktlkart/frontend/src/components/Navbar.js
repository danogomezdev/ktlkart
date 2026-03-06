import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggle } = useLang();
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const isActive = (path) => location.pathname === path;
  const links = lang === 'es'
    ? [{ to: '/', label: 'Inicio' }, { to: '/proyectos', label: 'Proyectos' }, { to: '/servicios', label: 'Servicios' }, { to: '/contacto', label: 'Contacto' }]
    : [{ to: '/', label: 'Home' }, { to: '/proyectos', label: 'Work' }, { to: '/servicios', label: 'Services' }, { to: '/contacto', label: 'Contact' }];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="logo-bracket">&lt;</span>
          dano<span className="logo-gold">gomezdev</span>
          <span className="logo-bracket"> /&gt;</span>
        </Link>

        <div className="navbar__right">
          <ul className={`navbar__links${menuOpen ? ' open' : ''}`}>
            {links.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={`navbar__link${isActive(to) ? ' active' : ''}`}>{label}</Link>
              </li>
            ))}
            <li>
              <Link to="/contacto" className="btn btn-gold navbar__cta">
                {lang === 'es' ? 'Contratar' : 'Hire me'}
              </Link>
            </li>
          </ul>

          <button className="lang-toggle" onClick={toggle}>
            {lang === 'es' ? '🇺🇸 EN' : '🇦🇷 ES'}
          </button>

          <button className={`navbar__burger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
