import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import kart1 from '../assets/kart1.jpeg';
import kart2 from '../assets/kart2.jpeg';
import './Gallery.css';

const API_URL = 'https://ktlkart-backend.onrender.com';

// Fotos de demo hasta que el admin suba las reales
const DEMO = [
  { id:1, url: null, _local: kart1, category:'chasis', title:'KTL Chasis 2025' },
  { id:2, url: null, _local: kart2, category:'chasis', title:'KTL Detalle' },
  { id:3, url: null, _local: kart1, category:'pista',  title:'KTL en Pista' },
  { id:4, url: null, _local: kart2, category:'pista',  title:'KTL en Pista' },
  { id:5, url: null, _local: kart1, category:'chasis', title:'KTL Chasis' },
  { id:6, url: null, _local: kart2, category:'chasis', title:'KTL Detalle' },
];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/gallery')
      .then(r => { setImages(r.data.length > 0 ? r.data : DEMO); setLoading(false); })
      .catch(() => { setImages(DEMO); setLoading(false); });
  }, []);

  const cats = ['todos', ...new Set(images.map(i => i.category).filter(Boolean))];
  const filtered = filter === 'todos' ? images : images.filter(i => i.category === filter);

  const getUrl = (img) => img._local ? img._local : `${API_URL}${img.url}`;

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="gallery-hero__inner">
          <h1>KTL en Pista</h1>
          <p>Imágenes de nuestros chasis en acción y en detalle</p>
        </div>
      </section>

      {lightbox !== null && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <button className="gallery-lightbox__close" onClick={() => setLightbox(null)}>✕</button>
          <button className="gallery-lightbox__prev" onClick={e => { e.stopPropagation(); setLightbox(l => (l-1+filtered.length)%filtered.length); }}>‹</button>
          <img src={getUrl(filtered[lightbox])} alt="" className="gallery-lightbox__img" onClick={e => e.stopPropagation()} />
          <button className="gallery-lightbox__next" onClick={e => { e.stopPropagation(); setLightbox(l => (l+1)%filtered.length); }}>›</button>
        </div>
      )}

      <section className="section">
        <div className="container">
          <div className="gallery-filters">
            {cats.map(c => (
              <button key={c} className={`filter-btn${filter===c?' active':''}`} onClick={() => setFilter(c)}>
                {c === 'todos' ? 'Todos' : c}
              </button>
            ))}
          </div>
          {loading
            ? <div className="loading"><div className="spinner"/></div>
            : filtered.length === 0
              ? <div className="gallery-empty"><p>No hay imágenes en esta categoría aún.</p></div>
              : (
                <div className="gallery-grid">
                  {filtered.map((img, i) => (
                    <div key={img.id} className="gallery-item" onClick={() => setLightbox(i)}>
                      <img src={getUrl(img)} alt={img.title || 'KTL Kart'} />
                      <div className="gallery-item__overlay">
                        <span className="gallery-item__cat">{img.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
          }
        </div>
      </section>
    </div>
  );
}
