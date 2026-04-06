import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getGallery } from '../utils/api';
import kart1 from '../assets/kart1.jpeg';
import kart2 from '../assets/kart2.jpeg';
import './Home.css';

const WA = 'https://wa.me/5493462597788';

const FALLBACK_MODELS = [
  { id: 1, cat: 'TIERRA',  name: 'KTL TIERRA',  img: kart1,
    desc: 'Generamos desarrollos para desembarcar en las exigentes categorías de tierra de nuestro país.',
    specs: [{ k: 'Superficie', v: 'Tierra' }, { k: 'Bancadas', v: '3 y 4' }, { k: 'Fabricación', v: 'Nacional' }] },
  { id: 2, cat: 'ASFALTO', name: 'KTL ASFALTO', img: kart2,
    desc: 'Generamos desarrollos para desembarcar en las exigentes categorías de asfalto de nuestro país.',
    specs: [{ k: 'Superficie', v: 'Asfalto' }, { k: 'Bancadas', v: '3 y 4' }, { k: 'Fabricación', v: 'Nacional' }] },
  { id: 3, cat: 'ESCUELA', name: 'KTL ESCUELA', img: kart1,
    desc: 'Desarrollamos un chasis ideal para una de las partes más importantes de la carrera deportiva de un piloto.',
    specs: [{ k: 'Superficie', v: 'Mixto' }, { k: 'Bancadas', v: '3' }, { k: 'Fabricación', v: 'Nacional' }] },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getProducts().then(setProducts).catch(() => {});
    getGallery().then(d => setGallery(d.slice(0, 8))).catch(() => {});
  }, []);

  const models = FALLBACK_MODELS.map((m, i) => {
    const p = products[i];
    if (!p) return m;
    return {
      ...m, id: p.id, name: p.name, cat: p.category.toUpperCase(),
      desc: p.description,
      img: p.images?.[0] || m.img,
      specs: Object.entries(p.specs || {}).slice(0, 3).map(([k, v]) => ({ k, v }))
    };
  });

  const detailPhotos = gallery.length >= 4
    ? gallery.slice(0, 4)
    : [{ url: kart1 }, { url: kart2 }, { url: kart1 }, { url: kart2 }];

  const pistaPhotos = gallery.length >= 8
    ? gallery.slice(4, 8)
    : [{ url: kart2 }, { url: kart1 }, { url: kart2 }, { url: kart1 }];

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__bg-logo" />
          <div className="hero__bg-gradient" />
          <div className="hero__stripe" />
        </div>
        <div className="hero__content">
          <div className="hero__label">KTL Racing Kart · Fabricación Nacional</div>
          <div className="hero__kart-wrap">
            <img src={kart1} alt="KTL Racing Kart" className="hero__kart-img" />
            <div className="hero__kart-shadow" />
          </div>
          <h1 className="hero__title">Chasis de <span>Karting</span><br/>de Competición</h1>
          <p className="hero__sub">Fabricados en Argentina. Diseñados para ganar en tierra, asfalto y escuela.</p>
          <div className="hero__actions">
            <Link to="/productos" className="btn btn-primary">Ver Chasis →</Link>
            <a href={`${WA}?text=Hola! Quiero consultar sobre los chasis KTL.`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">WhatsApp</a>
          </div>
          <div className="hero__stats">
            <div className="hero__stat"><span>3</span><p>Modelos</p></div>
            <div className="hero__stat"><span>100%</span><p>Nacional</p></div>
            <div className="hero__stat"><span>∞</span><p>Soporte</p></div>
          </div>
        </div>
      </section>

      {/* ── BANDA KTL EN DETALLE ── */}
      <div className="detail-band">
        <div className="detail-band__inner container">
          <div className="detail-band__line" />
          <h2 className="detail-band__title">KTL EN DETALLE</h2>
          <div className="detail-band__line" />
        </div>
      </div>

      {/* ── FOTOS DETALLE 4 COL ── */}
      <div className="detail-photos">
        <div className="detail-photos__grid">
          {detailPhotos.map((img, i) => (
            <div key={i} className="detail-photo">
              <img src={img.url} alt={`Detalle KTL ${i + 1}`} />
              <div className="detail-photo__overlay" />
            </div>
          ))}
        </div>
      </div>

      {/* ── MODELOS ALTERNADOS ── */}
      {models.map((m, i) => (
        <section key={m.id} className="model-section">
          <div className={`model-section__inner${i % 2 !== 0 ? ' reversed' : ''}`}>
            <div className="model-section__img">
              <img src={typeof m.img === 'string' ? m.img : m.img} alt={m.name} />
            </div>
            <div className="model-section__body">
              <span className="model-section__cat">{m.cat}</span>
              <h2>{m.name}</h2>
              <p>{m.desc}</p>
              <div className="model-section__specs">
                {m.specs.map((s, j) => (
                  <div key={j} className="model-spec">
                    <span>{s.k}</span>
                    <strong>{s.v}</strong>
                  </div>
                ))}
              </div>
              <div className="model-section__actions">
                <Link to={`/productos/${m.id}`} className="btn btn-primary">Ver detalles</Link>
                <a href={`${WA}?text=Hola! Me interesa el ${m.name}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">WhatsApp</a>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── BANDA KTL EN PISTA ── */}
      <div className="pista-section">
        <div className="pista-band">
          <div className="container">
            <h2>KTL EN PISTA</h2>
          </div>
        </div>
        <div className="pista-grid">
          {pistaPhotos.map((img, i) => (
            <div key={i} className="pista-photo">
              <img src={img.url} alt={`KTL en pista ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-box container">
          <h2>¿Listo para<br/>competir?</h2>
          <p>Contactanos y encontrá el chasis ideal para tu categoría.</p>
          <div className="cta-box__actions">
            <Link to="/contacto" className="btn btn-primary">Hacer una consulta</Link>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Escribir por WhatsApp</a>
          </div>
        </div>
      </section>

    </div>
  );
}
