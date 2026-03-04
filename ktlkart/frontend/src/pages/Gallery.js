import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './Gallery.css';

const FILTERS = ['Todos', 'tierra', 'asfalto', 'escuela', 'general'];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/gallery').then(r => { setImages(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'Todos' ? images : images.filter(i => i.product === filter);

  return (
    <div className="gallery-page">
      <div className="gallery-hero">
        <div className="container">
          <h1>Galería <span>de Fotos</span></h1>
          <p>Conocé los chasis KTL Kart en detalle</p>
        </div>
      </div>

      <div className="section container">
        <div className="gallery-filters">
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="gallery-empty">
            <span>📷</span>
            <h3>Fotos próximamente</h3>
            <p>Estamos preparando el contenido visual. ¡Volvé pronto!</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {filtered.map((img) => (
              <div key={img.id} className="gallery-item" onClick={() => setLightbox(img)}>
                <img src={`http://localhost:5000${img.url}`} alt={img.caption || img.product} loading="lazy" />
                <div className="gallery-item__overlay">
                  <span>{img.product}</span>
                  {img.caption && <p>{img.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox__close" onClick={() => setLightbox(null)}>✕</button>
          <div className="lightbox__content" onClick={e => e.stopPropagation()}>
            <img src={`http://localhost:5000${lightbox.url}`} alt={lightbox.caption} />
            {lightbox.caption && <p>{lightbox.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
