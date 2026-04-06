import React, { useEffect, useState } from 'react';
import { getGallery } from '../utils/api';
import './Gallery.css';

const FILTERS = ['todos', 'general', 'tierra', 'asfalto', 'escuela'];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getGallery().then(d => { setImages(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const filtered = filter === 'todos' ? images : images.filter(i => i.product === filter);

  const prev = () => setLightbox(l => { const i = filtered.findIndex(x => x.id === l.id); return filtered[(i - 1 + filtered.length) % filtered.length]; });
  const next = () => setLightbox(l => { const i = filtered.findIndex(x => x.id === l.id); return filtered[(i + 1) % filtered.length]; });

  return (
    <div className="gallery-page">
      <div className="gallery-hero">
        <div className="gallery-hero__inner container">
          <h1>Galería</h1>
          <p>Nuestros chasis en acción y en detalle</p>
        </div>
      </div>

      <div className="section gallery-section container">
        <div className="gallery-filters">
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading && <div className="loading"><div className="spinner" /></div>}

        {!loading && filtered.length === 0 && (
          <div className="gallery-empty"><p>No hay fotos en esta categoría aún.</p></div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="gallery-grid">
            {filtered.map(img => (
              <div key={img.id} className="gallery-item" onClick={() => setLightbox(img)}>
                <img src={img.url} alt={img.caption || 'KTL Racing Kart'} loading="lazy" />
                <div className="gallery-item__overlay">
                  <span className="gallery-item__cat">{img.product}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <button className="gallery-lightbox__close" onClick={() => setLightbox(null)}>✕</button>
          <button className="gallery-lightbox__prev" onClick={e => { e.stopPropagation(); prev(); }}>‹</button>
          <img src={lightbox.url} alt={lightbox.caption || ''} className="gallery-lightbox__img" onClick={e => e.stopPropagation()} />
          <button className="gallery-lightbox__next" onClick={e => { e.stopPropagation(); next(); }}>›</button>
        </div>
      )}
    </div>
  );
}
