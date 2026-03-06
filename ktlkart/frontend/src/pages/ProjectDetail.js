import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import api from '../utils/api';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const [project, setProject] = useState(null);
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5001';

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/projects/${slug}`).then(r => { setProject(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{paddingTop:120}} className="loading"><div className="spinner"/></div>;
  if (!project) return <div style={{paddingTop:140,textAlign:'center'}}><h2>Proyecto no encontrado</h2><Link to="/proyectos" className="btn btn-gold" style={{marginTop:24}}>← {t('Volver', 'Back')}</Link></div>;

  return (
    <div className="project-detail">
      {lightbox !== null && (
        <div className="detail-lightbox" onClick={() => setLightbox(null)}>
          <button className="detail-lightbox__close" onClick={() => setLightbox(null)}>✕</button>
          <button className="detail-lightbox__prev" onClick={e => { e.stopPropagation(); setLightbox(l => (l-1+project.images.length)%project.images.length); }}>‹</button>
          <div className="detail-lightbox__img" onClick={e => e.stopPropagation()}>
            <img src={`${API}${project.images[lightbox]}`} alt="" />
            <span>{lightbox+1} / {project.images.length}</span>
          </div>
          <button className="detail-lightbox__next" onClick={e => { e.stopPropagation(); setLightbox(l => (l+1)%project.images.length); }}>›</button>
        </div>
      )}

      <section className="project-detail__hero">
        <div className="project-detail__hero-bg" />
        <div className="container">
          <div className="project-detail__breadcrumb">
            <Link to="/proyectos">{t('Proyectos', 'Projects')}</Link> › {lang === 'es' ? project.title : (project.titleEn || project.title)}
          </div>
          <div className="project-detail__header">
            <div>
              <span className="project-row__cat">{project.category}</span>
              <h1>{lang === 'es' ? project.title : (project.titleEn || project.title)}</h1>
            </div>
            <div className="project-detail__actions">
              {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">{t('Ver en vivo', 'Live demo')} →</a>}
              {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold">GitHub</a>}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container project-detail__body">
          <div className="project-detail__gallery">
            <div className="gallery__main" onClick={() => project.images?.length > 0 && setLightbox(selected)} style={{cursor: project.images?.length > 0 ? 'zoom-in' : 'default'}}>
              {project.images?.length > 0
                ? <img src={`${API}${project.images[selected]}`} alt={project.title} />
                : <div className="gallery__empty"><span>💻</span><p>{t('Fotos próximamente', 'Photos coming soon')}</p></div>
              }
              {project.images?.length > 1 && (
                <>
                  <button className="gallery__arrow gallery__arrow--prev" onClick={e => { e.stopPropagation(); setSelected(s => (s-1+project.images.length)%project.images.length); }}>‹</button>
                  <button className="gallery__arrow gallery__arrow--next" onClick={e => { e.stopPropagation(); setSelected(s => (s+1)%project.images.length); }}>›</button>
                  <div className="gallery__counter">{selected+1}/{project.images.length}</div>
                </>
              )}
            </div>
            {project.images?.length > 1 && (
              <div className="gallery__thumbs">
                {project.images.map((img, i) => (
                  <button key={i} className={`gallery__thumb${selected === i ? ' active' : ''}`} onClick={() => setSelected(i)}>
                    <img src={`${API}${img}`} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="project-detail__info">
            <div className="detail-section">
              <h3>{t('Descripción', 'Description')}</h3>
              <p>{lang === 'es' ? project.description : (project.descriptionEn || project.description)}</p>
            </div>
            <div className="detail-section">
              <h3>{t('Tecnologías', 'Technologies')}</h3>
              <div className="detail-tech">{project.tech?.map(t => <span key={t} className="badge badge-gold">{t}</span>)}</div>
            </div>
            <div className="detail-section">
              <h3>{t('Links', 'Links')}</h3>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="detail-link">🌐 {t('Ver sitio en vivo', 'View live site')} →</a>}
                {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="detail-link">💻 GitHub →</a>}
              </div>
            </div>
            <Link to="/contacto" className="btn btn-gold" style={{width:'100%',justifyContent:'center',padding:'16px'}}>
              {t('¿Querés algo similar?', 'Want something similar?')} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
