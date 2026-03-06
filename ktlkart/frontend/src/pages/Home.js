import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import api from '../utils/api';
import './Home.css';

const TECH = ['React', 'Node.js', 'Express', 'JavaScript', 'CSS3', 'Git', 'REST API', 'JWT'];

export default function Home() {
  const { t, lang } = useLang();
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get('/projects?featured=true&status=published').then(r => setProjects(r.data.slice(0,3))).catch(()=>{});
    api.get('/services').then(r => setServices(r.data.slice(0,3))).catch(()=>{});
    api.get('/settings').then(r => setSettings(r.data)).catch(()=>{});
    api.get('/testimonials').then(r => setTestimonials(r.data)).catch(()=>{});
  }, []);

  const API = process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5001';

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__grid" />
          <div className="hero__glow hero__glow--1" />
          <div className="hero__glow hero__glow--2" />
          <div className="hero__stripe" />
          <div className="hero__stripe-2" />
        </div>
        <div className="container hero__inner">
          <div className="hero__content">
            <div className="hero__badge">
              <span className="badge badge-green">
                <span style={{width:8,height:8,borderRadius:'50%',background:'#22c55e',display:'inline-block',animation:'blink 2s infinite'}}/>
                {t('Disponible para proyectos', 'Available for projects')}
              </span>
            </div>
            <p className="hero__greeting">{t('Hola, soy', 'Hi, I\'m')}</p>
            <h1 className="hero__name">
              Daniel<br/>
              <span className="gold-gradient">Gomez</span>
            </h1>
            <div className="hero__role">
              <span className="hero__role-text">Full Stack Developer</span>
              <span className="hero__role-dot">·</span>
              <span className="hero__role-text">React & Node.js</span>
            </div>
            <p className="hero__tagline">
              {t(
                settings?.tagline || 'Convirtiendo ideas en experiencias digitales que convierten.',
                settings?.taglineEn || 'Turning ideas into digital experiences that convert.'
              )}
            </p>
            <div className="hero__cta">
              <Link to="/contacto" className="btn btn-gold">
                {t('Contratar ahora', 'Hire me now')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link to="/proyectos" className="btn btn-outline-gold">
                {t('Ver proyectos', 'View work')}
              </Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="stat-number">{settings?.projectsDone || '5+'}</span>
                <span className="stat-label">{t('Proyectos', 'Projects')}</span>
              </div>
              <div className="hero__stat-div" />
              <div className="hero__stat">
                <span className="stat-number">{settings?.happyClients || '3+'}</span>
                <span className="stat-label">{t('Clientes', 'Clients')}</span>
              </div>
              <div className="hero__stat-div" />
              <div className="hero__stat">
                <span className="stat-number">{settings?.yearsExp || '2+'}</span>
                <span className="stat-label">{t('Años exp.', 'Years exp.')}</span>
              </div>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__avatar-wrap">
              {settings?.avatar
                ? <img src={`${API}${settings.avatar}`} alt="Daniel Gomez" className="hero__avatar" />
                : <div className="hero__avatar-placeholder">
                    <span>DG</span>
                  </div>
              }
              <div className="hero__avatar-ring" />
              <div className="hero__avatar-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Full Stack
              </div>
            </div>
            <div className="hero__code-card">
              <div className="code-card__dots"><span/><span/><span/></div>
              <pre className="code-card__code">{`const dev = {
  name: "danogomezdev",
  stack: ["React", "Node.js"],
  available: true,
  coffee: "☕ always"
}`}</pre>
            </div>
          </div>
        </div>
        <div className="hero__scroll">
          <div className="scroll-indicator">
            <div className="scroll-dot" />
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="tech-strip">
        <div className="tech-strip__track">
          {[...TECH, ...TECH].map((t, i) => (
            <span key={i} className="tech-chip">{t}</span>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="section about">
        <div className="container about__inner">
          <div className="about__text">
            <p className="section-label">{t('Sobre mí', 'About me')}</p>
            <h2 className="section-title">
              {t('Desarrollador apasionado por', 'Developer passionate about')}<br/>
              <span className="gold-gradient">{t('construir soluciones reales', 'building real solutions')}</span>
            </h2>
            <div className="gold-line" />
            <p className="about__bio">
              {t(
                settings?.bio || 'Soy desarrollador Full Stack con experiencia en React y Node.js. Me especializo en construir aplicaciones web modernas, rápidas y escalables. Trabajo con clientes de Argentina y el exterior para llevar sus ideas al mundo digital.',
                settings?.bioEn || "I'm a Full Stack developer experienced in React and Node.js. I specialize in building modern, fast, and scalable web applications. I work with clients from Argentina and abroad to bring their ideas to the digital world."
              )}
            </p>
            <div className="about__skills">
              {TECH.map(skill => (
                <span key={skill} className="badge badge-gold">{skill}</span>
              ))}
            </div>
            <Link to="/contacto" className="btn btn-gold" style={{marginTop:'28px'}}>
              {t('Trabajemos juntos', "Let's work together")} →
            </Link>
          </div>
          <div className="about__cards">
            {[
              { icon: '⚡', title: t('Rápido', 'Fast'), desc: t('Entrega en los tiempos acordados, siempre.', 'Delivery on time, always.') },
              { icon: '🎨', title: t('Diseño premium', 'Premium design'), desc: t('Interfaces modernas que impresionan a tus clientes.', 'Modern interfaces that impress your clients.') },
              { icon: '📱', title: t('Responsive', 'Responsive'), desc: t('Perfecto en celular, tablet y desktop.', 'Perfect on mobile, tablet, and desktop.') },
              { icon: '🔧', title: t('Soporte continuo', 'Ongoing support'), desc: t('Estoy disponible después de la entrega.', 'Available after delivery.') },
            ].map((card, i) => (
              <div key={i} className="about__card glass-card">
                <span className="about__card-icon">{card.icon}</span>
                <h4>{card.title}</h4>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES PREVIEW ── */}
      <section className="section services-preview">
        <div className="services-preview__bg" />
        <div className="container">
          <div className="services-preview__header">
            <div>
              <p className="section-label">{t('Qué hago', 'What I do')}</p>
              <h2 className="section-title">{t('Servicios', 'Services')}</h2>
            </div>
            <Link to="/servicios" className="btn btn-outline-gold">{t('Ver todos', 'View all')} →</Link>
          </div>
          <div className="services-grid">
            {services.map(s => (
              <div key={s.id} className="service-card glass-card">
                <div className="service-card__icon">{s.icon}</div>
                <h3>{lang === 'es' ? s.title : (s.titleEn || s.title)}</h3>
                <p>{lang === 'es' ? s.description : (s.descriptionEn || s.description)}</p>
                <div className="service-card__price">
                  <span>{lang === 'es' ? s.priceLabel : (s.priceLabelEn || s.priceLabel)}</span>
                </div>
                <Link to="/servicios" className="service-card__link">
                  {t('Ver detalles', 'View details')} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS PREVIEW ── */}
      <section className="section projects-preview">
        <div className="container">
          <div className="services-preview__header">
            <div>
              <p className="section-label">{t('Mi trabajo', 'My work')}</p>
              <h2 className="section-title">{t('Proyectos destacados', 'Featured projects')}</h2>
            </div>
            <Link to="/proyectos" className="btn btn-outline-gold">{t('Ver todos', 'View all')} →</Link>
          </div>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <Link to={`/proyectos/${p.slug}`} key={p.id} className={`project-card glass-card${i === 0 ? ' featured' : ''}`}>
                <div className="project-card__img">
                  {p.images?.[0]
                    ? <img src={`${API}${p.images[0]}`} alt={p.title} />
                    : <div className="project-card__placeholder"><span>💻</span></div>
                  }
                  <div className="project-card__overlay">
                    <span>{t('Ver proyecto', 'View project')} →</span>
                  </div>
                </div>
                <div className="project-card__info">
                  <span className="project-card__cat">{p.category}</span>
                  <h3>{lang === 'es' ? p.title : (p.titleEn || p.title)}</h3>
                  <p>{(lang === 'es' ? p.description : (p.descriptionEn || p.description))?.slice(0,120)}...</p>
                  <div className="project-card__tech">
                    {p.tech?.slice(0,4).map(t => <span key={t} className="badge badge-gold">{t}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="section testimonials">
          <div className="testimonials__bg" />
          <div className="container">
            <p className="section-label" style={{justifyContent:'center'}}>{t('Testimonios', 'Testimonials')}</p>
            <h2 className="section-title" style={{textAlign:'center',marginBottom:'56px'}}>
              {t('Lo que dicen mis clientes', 'What my clients say')}
            </h2>
            <div className="testimonials-grid">
              {testimonials.map(tm => (
                <div key={tm.id} className="testimonial-card glass-card">
                  <div className="testimonial-card__stars">{'⭐'.repeat(tm.rating || 5)}</div>
                  <p>"{lang === 'es' ? tm.text : (tm.textEn || tm.text)}"</p>
                  <div className="testimonial-card__author">
                    <div className="testimonial-card__avatar">{tm.name?.[0]}</div>
                    <div>
                      <strong>{tm.name}</strong>
                      <span>{tm.role} · {tm.company}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="cta-section__glow" />
        <div className="container cta-section__inner">
          <p className="section-label" style={{justifyContent:'center'}}>{t('¿Listo para empezar?', 'Ready to start?')}</p>
          <h2 className="section-title" style={{textAlign:'center'}}>
            {t('Hablemos de tu', "Let's talk about your")}<br/>
            <span className="gold-gradient">{t('próximo proyecto', 'next project')}</span>
          </h2>
          <p className="cta-section__sub">
            {t('Escribime hoy y recibí una cotización sin compromiso en menos de 24hs.', "Contact me today and receive a free quote in less than 24 hours.")}
          </p>
          <div className="cta-section__btns">
            <Link to="/contacto" className="btn btn-gold" style={{padding:'16px 40px',fontSize:'15px'}}>
              {t('Empezar proyecto', 'Start a project')} 🚀
            </Link>
            <a href="https://wa.me/5493462688065" target="_blank" rel="noopener noreferrer" className="btn btn-dark" style={{padding:'16px 40px',fontSize:'15px'}}>
              WhatsApp →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
