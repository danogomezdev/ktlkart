import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import kart1 from '../assets/kart1.jpeg';
import kart2 from '../assets/kart2.jpeg';
import './Home.css';

const WA = 'https://wa.me/5493462597788';
const API_URL = 'https://ktlkart-backend.onrender.com';

// placeholder kart details mientras no hay fotos cargadas en el admin
const MODELS = [
  {
    id: null, cat: 'TIERRA', name: 'KTL TIERRA', slug: null,
    desc: 'Generamos desarrollos para desembarcar en las exigentes categorías de tierra de nuestro país, donde logramos una competitiva herramienta para pelear las diferentes divisionales.',
    img: kart1,
    specs: [{ k: 'Superficie', v: 'Tierra' }, { k: 'Bancadas', v: '3 y 4' }, { k: 'Fabricación', v: 'Nacional' }]
  },
  {
    id: null, cat: 'ASFALTO', name: 'KTL ASFALTO', slug: null,
    desc: 'Generamos desarrollos para desembarcar en las exigentes categorías de asfalto de nuestro país en donde logramos una competitiva herramienta para pelear las diferentes divisionales.',
    img: kart2,
    specs: [{ k: 'Superficie', v: 'Asfalto' }, { k: 'Bancadas', v: '3 y 4' }, { k: 'Fabricación', v: 'Nacional' }]
  },
  {
    id: null, cat: 'ESCUELA', name: 'KTL ESCUELA', slug: null,
    desc: 'Desarrollamos un chasis ideal para una de las partes más importantes de la carrera deportiva de un piloto: sus comienzos, en donde buscamos un chasis ágil y simple de conducir.',
    img: kart1,
    specs: [{ k: 'Superficie', v: 'Mixto' }, { k: 'Bancadas', v: '3' }, { k: 'Fabricación', v: 'Nacional' }]
  }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/products').then(r => setProducts(r.data)).catch(() => {});
    api.get('/gallery').then(r => setGalleryImages(r.data.slice(0, 8))).catch(() => {});
  }, []);

  // Merge API products with fallback MODELS
  const models = MODELS.map((m, i) => {
    const p = products[i];
    if (p) return {
      ...m, id: p.id, name: p.name, desc: p.description, slug: p.id,
      img: p.images?.[0] ? `${API_URL}${p.images[0]}` : m.img,
      specs: Object.entries(p.specs || {}).slice(0,3).map(([k,v]) => ({k,v}))
    };
    return m;
  });

  return (
    <div className="home">

      {/* ── HERO: kart centrado + título abajo, igual al WP ── */}
      <section className="hero">
        <div className="hero__bg-logo" />
        <div className="hero__bg-gradient" />
        <div className="hero__content">
          <div className="hero__kart-wrap">
            <div className="hero__kart-shadow" />
            <img src={kart1} alt="KTL Racing Kart 2025" className="hero__kart-img" />
          </div>
          <div className="hero__divider" />
          <h1 className="hero__title">
            KTL Racing Kart
            <span>Style 2025</span>
          </h1>
          <p className="hero__sub">
            Chasis de karting de alta performance. Diseñados y fabricados en Argentina
            para Tierra, Asfalto y Escuela. La tecnología que necesitás para ganar.
          </p>
          <div className="hero__actions">
            <Link to="/productos" className="btn btn-primary">Ver Chasis</Link>
            <a href={`${WA}?text=Hola! Quiero consultar sobre los chasis KTL.`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a.526.526 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
          <div className="hero__stats">
            <div className="hero__stat"><span>3</span><p>Modelos</p></div>
            <div className="hero__stat"><span>100%</span><p>Nacional</p></div>
            <div className="hero__stat"><span>∞</span><p>Soporte</p></div>
          </div>
        </div>
      </section>

      {/* ── KTL EN DETALLE (dark band like WP) ── */}
      <div className="detail-band">
        <div className="container detail-band__inner">
          <div className="detail-band__line" />
          <h2 className="detail-band__title">KTL EN DETALLE</h2>
          <div className="detail-band__line" />
        </div>
      </div>

      {/* ── 4-col photo grid ── */}
      <div className="detail-photos">
        <div className="detail-photos__grid">
          {[kart1, kart2, kart1, kart2].map((img, i) => (
            <div key={i} className="detail-photo">
              <img src={img} alt={`KTL detalle ${i+1}`} />
              <div className="detail-photo__overlay" />
            </div>
          ))}
        </div>
      </div>

      {/* ── ALTERNATING MODELS (Asfalto / Escuela style from WP) ── */}
      {models.map((m, i) => (
        <section className="model-section" key={m.cat}>
          <div className={`model-section__inner${i % 2 === 1 ? ' reversed' : ''}`}>
            <div className="model-section__img">
              <img src={m.img} alt={m.name} />
            </div>
            <div className="model-section__body">
              <div className="model-section__cat">{m.cat}</div>
              <h2>{m.name}</h2>
              <p>{m.desc}</p>
              <div className="model-section__specs">
                {m.specs.map(s => (
                  <div key={s.k} className="model-spec">
                    <span>{s.k}</span><strong>{s.v}</strong>
                  </div>
                ))}
              </div>
              <div className="model-section__actions">
                {m.slug
                  ? <Link to={`/productos/${m.slug}`} className="btn btn-primary">Ver detalles</Link>
                  : <Link to="/productos" className="btn btn-primary">Ver detalles</Link>
                }
                <a href={`${WA}?text=Hola! Me interesa el ${m.name}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">WhatsApp</a>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── KTL EN PISTA (gallery strip like WP) ── */}
      <section className="pista-section">
        <div className="pista-band">
          <div className="container">
            <h2>KTL EN PISTA</h2>
          </div>
        </div>
        <div className="pista-grid">
          {galleryImages.length > 0
            ? galleryImages.slice(0,4).map((img, i) => (
                <div key={i} className="pista-photo">
                  <img src={`${API_URL}${img.url}`} alt={img.title || 'KTL en pista'} />
                </div>
              ))
            : [kart2, kart1, kart2, kart1].map((img, i) => (
                <div key={i} className="pista-photo">
                  <img src={img} alt={`KTL en pista ${i+1}`} />
                </div>
              ))
          }
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>¿Listo para correr?</h2>
            <p>Consultanos por el modelo que más se adapta a tus necesidades. Respondemos rápido.</p>
            <div className="cta-box__actions">
              <Link to="/contacto" className="btn btn-primary">Hacer una consulta</Link>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Escribir por WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
