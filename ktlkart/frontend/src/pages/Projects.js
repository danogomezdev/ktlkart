import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import api from '../utils/api';
import './Projects.css';

export default function Projects() {
  const { t, lang } = useLang();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const API = process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5001';

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/projects?status=published').then(r => { setProjects(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const cats = ['all', ...new Set(projects.map(p => p.category))];
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <div className="projects-hero__bg" />
        <div className="container projects-hero__inner">
          <p className="section-label">{t('Mi trabajo', 'My work')}</p>
          <h1 className="section-title">
            {t('Proyectos', 'Projects &')}<br/>
            <span className="gold-gradient">{t('& Portfolio', 'Portfolio')}</span>
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="projects-filters">
            {cats.map(c => (
              <button key={c} className={`filter-btn${filter === c ? ' active' : ''}`} onClick={() => setFilter(c)}>
                {c === 'all' ? t('Todos', 'All') : c}
              </button>
            ))}
          </div>

          {loading ? <div className="loading"><div className="spinner" /></div> : (
            <div className="projects-list">
              {filtered.map((p, i) => (
                <div key={p.id} className={`project-row glass-card${i % 2 === 1 ? ' reversed' : ''}`}>
                  <div className="project-row__img">
                    {p.images?.[0]
                      ? <img src={`${API}${p.images[0]}`} alt={p.title} />
                      : <div className="project-row__placeholder"><span>💻</span></div>
                    }
                  </div>
                  <div className="project-row__info">
                    <span className="project-row__cat">{p.category}</span>
                    <h2>{lang === 'es' ? p.title : (p.titleEn || p.title)}</h2>
                    <p>{lang === 'es' ? p.description : (p.descriptionEn || p.description)}</p>
                    <div className="project-row__tech">
                      {p.tech?.map(tech => <span key={tech} className="badge badge-gold">{tech}</span>)}
                    </div>
                    <div className="project-row__links">
                      {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                        {t('Ver en vivo', 'Live demo')} →
                      </a>}
                      {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold">
                        GitHub →
                      </a>}
                      <Link to={`/proyectos/${p.slug}`} className="btn btn-dark">
                        {t('Detalles', 'Details')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{textAlign:'center',padding:'80px 0',color:'var(--gray-600)'}}>
                  {t('No hay proyectos en esta categoría.', 'No projects in this category.')}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
