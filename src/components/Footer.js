import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/LOGO.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <div className="footer__logo"><img src={logo} alt="KTL Racing Kart"/></div>
            <p>Fabricantes de chasis de karting de alta performance. Tierra, Asfalto y Escuela. 100% nacional, diseñado para ganar.</p>
            <div className="footer__social">
              <a href="https://wa.me/5493462597788" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a href="/contacto">Contacto</a>
            </div>
          </div>
          <div className="footer__col">
            <h4>Navegación</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Style 2025</Link></li>
              <li><Link to="/galeria">Galería</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Contacto</h4>
            <p>📱 +54 9 3462 597788</p>
            <p>📧 Gonzalovega23@icloud.com</p>
            <p>📍 Argentina</p>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} KTL Racing Kart. Todos los derechos reservados.</p>
          <Link to="/admin/login">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
