import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import './Footer.css';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="logo-bracket">&lt;</span>dano<span className="logo-gold">gomezdev</span><span className="logo-bracket"> /&gt;</span>
          </div>
          <p>{t('Full Stack Developer especializado en React y Node.js. Construyo experiencias digitales que convierten.', 'Full Stack Developer specialized in React and Node.js. I build digital experiences that convert.')}</p>
          <div className="footer__social">
            <a href="https://github.com/danogomezdev" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
            <a href="https://wa.me/5493462688065" target="_blank" rel="noopener noreferrer" className="social-link">WhatsApp</a>
          </div>
        </div>
        <div className="footer__links">
          <h4>{t('Navegación', 'Navigation')}</h4>
          <ul>
            <li><Link to="/">{t('Inicio', 'Home')}</Link></li>
            <li><Link to="/proyectos">{t('Proyectos', 'Work')}</Link></li>
            <li><Link to="/servicios">{t('Servicios', 'Services')}</Link></li>
            <li><Link to="/contacto">{t('Contacto', 'Contact')}</Link></li>
          </ul>
        </div>
        <div className="footer__links">
          <h4>{t('Servicios', 'Services')}</h4>
          <ul>
            <li><Link to="/servicios">Landing Page</Link></li>
            <li><Link to="/servicios">{t('Sitio Corporativo', 'Corporate Website')}</Link></li>
            <li><Link to="/servicios">E-commerce</Link></li>
            <li><Link to="/servicios">Web App Full Stack</Link></li>
          </ul>
        </div>
        <div className="footer__contact">
          <h4>{t('Contacto', 'Contact')}</h4>
          <p>📧 danogomezdev@gmail.com</p>
          <p>📱 +54 9 3462 688065</p>
          <p>📍 {t('Cañada de Gómez, Argentina', 'Cañada de Gómez, Argentina')}</p>
          <div className="footer__avail">
            <span className="avail-dot" />
            {t('Disponible para proyectos', 'Available for projects')}
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} danogomezdev. {t('Todos los derechos reservados.', 'All rights reserved.')}</p>
          <Link to="/admin/login" className="footer__admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
