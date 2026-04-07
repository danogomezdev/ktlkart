import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getGallery } from '../utils/api';
import { getGalleryUrl, getMainUrl } from '../utils/imgUtils';
import kart1 from '../assets/kart1.jpeg';
import kart2 from '../assets/kart2.jpeg';
import chasis2 from '../assets/chasis2.png';
import './Home.css';

const WA = 'https://wa.me/5493462597788';

const FALLBACK_MODELS = [
  { id: 1, cat: 'TIERRA',  name: 'KTL TIERRA',  num: '01', img: kart1,
    desc: 'Generamos desarrollos para desembarcar en las exigentes categorías de tierra de nuestro país, donde logramos una competitiva herramienta para pelear las diferentes divisionales.',
    specs: [{ k: 'Superficie', v: 'Tierra' }, { k: 'Bancadas', v: '3 y 4' }, { k: 'Fabricación', v: 'Nacional' }] },
  { id: 2, cat: 'ASFALTO', name: 'KTL ASFALTO', num: '02', img: kart2,
    desc: 'Generamos desarrollos para desembarcar en las exigentes categorías de asfalto de nuestro país, logrando una herramienta competitiva para las diferentes divisionales.',
    specs: [{ k: 'Superficie', v: 'Asfalto' }, { k: 'Bancadas', v: '3 y 4' }, { k: 'Fabricación', v: 'Nacional' }] },
  { id: 3, cat: 'ESCUELA', name: 'KTL ESCUELA', num: '03', img: kart1,
    desc: 'Desarrollamos un chasis ideal para una de las partes más importantes de la carrera deportiva de un piloto: sus comienzos.',
    specs: [{ k: 'Superficie', v: 'Mixto' }, { k: 'Bancadas', v: '3' }, { k: 'Fabricación', v: 'Nacional' }] },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const modelRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getProducts().then(setProducts).catch(() => {});
    getGallery().then(d => setGallery(d.slice(0, 8))).catch(() => {});
  }, []);

  const scrollToModel = (index) => {
    const el = modelRefs.current[index];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const models = FALLBACK_MODELS.map((m, i) => {
    const p = products[i];
    if (!p) return m;
    return {
      ...m, id: p.id, name: p.name, cat: p.category.toUpperCase(),
      desc: p.description,
      img: p.images?.[0] ? getMainUrl(p.images[0]) : m.img,
      specs: Object.entries(p.specs || {}).slice(0, 3).map(([k, v]) => ({ k, v }))
    };
  });

  const detailPhotos = gallery.length >= 4
    ? gallery.slice(0, 4)
    : [{ url: kart1 }, { url: kart2 }, { url: kart1 }, { url: kart2 }];

  const heroBgPhoto = gallery.length > 0 ? gallery[0].url : kart2;

  return (
    <div className="home">

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__bg-photo" style={{backgroundImage: `url(${heroBgPhoto})`}} />
          <div className="hero__bg-overlay" />
          <div className="hero__bg-logo" />
          <div className="hero__stripe" />
          <div className="hero__stripe hero__stripe--2" />
        </div>

        {/* Texto izquierda */}
        <div className="hero__content">
          <div className="hero__label">KTL Racing Kart · Fabricación Nacional</div>
          <h1 className="hero__title">Chasis de<br/><span>Karting</span><br/>Competición</h1>
          <div className="hero__actions">
            <Link to="/productos" className="btn btn-primary">Nuestros Modelos →</Link>
          </div>
          {/* Stats clickeables que scrollean al modelo */}
          <div className="hero__stats">
            {['TIERRA', 'ASFALTO', 'ESCUELA'].map((cat, i) => (
              <button key={cat} className="hero__stat hero__stat--btn" onClick={() => scrollToModel(i)}>
                <span>{cat}</span>
                <p>{i === 0 ? 'Pistas de tierra' : i === 1 ? 'Pistas de asfalto' : 'Categoría inicial'}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Kart derecha */}
        <div className="hero__visual">
          <div className="hero__kart-wrap">
            <img src={chasis2} alt="KTL Racing Kart" className="hero__kart-img" />
            <div className="hero__kart-shadow" />
          </div>
        </div>
      </section>

      {/* ══ MODELS ══ */}
      <section className="models-section">
        <div className="models-section__header container">
          <div className="models-section__label">Línea de productos</div>
          <h2 className="models-section__title">Nuestros <span>Chasis</span></h2>
        </div>
        {models.map((m, i) => (
          <div
            key={m.id}
            className={`model-card${i % 2 !== 0 ? ' model-card--rev' : ''}`}
            ref={el => modelRefs.current[i] = el}
          >
            <div className="model-card__num">{m.num}</div>
            <div className="model-card__img">
              <img src={typeof m.img === 'string' ? m.img : m.img} alt={m.name} loading="lazy" />
              <div className="model-card__img-overlay" />
            </div>
            <div className="model-card__body">
              <span className="model-card__cat">{m.cat}</span>
              <h3 className="model-card__name">{m.name}</h3>
              <p className="model-card__desc">{m.desc}</p>
              <div className="model-card__specs">
                {m.specs.map((s, j) => (
                  <div key={j} className="model-card__spec">
                    <span>{s.k}</span><strong>{s.v}</strong>
                  </div>
                ))}
              </div>
              <div className="model-card__actions">
                <Link to={`/productos/${m.id}`} className="btn btn-primary">Ver detalles →</Link>
                <a href={`${WA}?text=Hola! Me interesa el ${m.name}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">WhatsApp</a>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ══ TICKER ══ */}
      <div className="fab-strip">
        <div className="fab-strip__track">
          {['ACERO NACIONAL','SOLDADURA TIG','DISEÑO PROPIO','COMPETICIÓN','KARTING ARGENTINO','TIERRA','ASFALTO','ESCUELA',
            'ACERO NACIONAL','SOLDADURA TIG','DISEÑO PROPIO','COMPETICIÓN','KARTING ARGENTINO','TIERRA','ASFALTO','ESCUELA'].map((t, i) => (
            <span key={i} className="fab-strip__item">
              <span className="fab-strip__dot">◆</span> {t}
            </span>
          ))}
        </div>
      </div>

      {/* ══ GALLERY MOSAIC ══ */}
      <section className="gallery-section">
        <div className="gallery-section__header container">
          <div>
            <div className="gallery-section__label">Galería</div>
            <h2 className="gallery-section__title">KTL <span>en pista</span></h2>
          </div>
          <Link to="/galeria" className="gallery-section__link">Ver todo →</Link>
        </div>
        <div className="gallery-mosaic">
          {detailPhotos.map((img, i) => (
            <div key={i} className={`mosaic-item mosaic-item--${i}`}>
              <img src={typeof img.url === 'string' ? getGalleryUrl(img.url) : img.url} alt={`KTL ${i+1}`} loading="lazy" />
              <div className="mosaic-item__overlay" />
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="cta-section">
        <div className="cta-box container">
          <div className="cta-box__text">
            <h2>¿Listo para<br/><span>competir?</span></h2>
            <p>Contactanos y encontrá el chasis ideal para tu categoría.</p>
          </div>
          <div className="cta-box__actions">
            <Link to="/contacto" className="btn btn-primary">Hacer una consulta</Link>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Escribir por WhatsApp</a>
          </div>
        </div>
      </section>

    </div>
  );
}
