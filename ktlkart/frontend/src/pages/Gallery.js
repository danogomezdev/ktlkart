import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './Gallery.css';

const API = 'https://ktlkart-backend.onrender.com';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/gallery').then(r => { setImages(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const cats = ['todos', ...new Set(images.map(i => i.category).filter(Boolean))];
  const filtered = filter === 'todos' ? images : images.filter(i => i.category === filter);

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="gallery-hero__bg" />
        <div className="gallery-hero__overlay" />
        <div className="container gallery-hero__inner">
          <p className="section-label">KTL en Pista</p>
          <h1 className="section-title">Galería <span>KTL</span></h1>
          <p className="section-subtitle">Imágenes de nuestros chasis en acción y en detalle</p>
        </div>
      </section>

      {lightbox !== null && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <button className="gallery-lightbox__close" onClick={() => setLightbox(null)}>✕</button>
          <button className="gallery-lightbox__prev" onClick={e => { e.stopPropagation(); setLightbox(l => (l-1+filtered.length)%filtered.length); }}>‹</button>
          <img src={`${API}${filtered[lightbox].url}`} alt="" className="gallery-lightbox__img" onClick={e => e.stopPropagation()} />
          <button className="gallery-lightbox__next" onClick={e => { e.stopPropagation(); setLightbox(l => (l+1)%filtered.length); }}>›</button>
        </div>
      )}

      <section className="section">
        <div className="container">
          <div className="gallery-filters">
            {cats.map(c => (
              <button key={c} className={`filter-btn${filter === c ? ' active' : ''}`} onClick={() => setFilter(c)}>
                {c === 'todos' ? 'Todos' : c}
              </button>
            ))}
          </div>
          {loading ? <div className="loading"><div className="spinner"/></div> : (
            <div className="gallery-grid">
              {filtered.map((img, i) => (
                <div key={img.id} className="gallery-item" onClick={() => setLightbox(i)}>
                  <img src={`${API}${img.url}`} alt={img.title || 'KTL Kart'} />
                  <div className="gallery-item__overlay">
                    <span className="gallery-item__cat">{img.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div style={{textAlign:'center',padding:'60px 0',color:'var(--gray-600)'}}>
              <p style={{fontSize:18}}>No hay imágenes en esta categoría aún.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
