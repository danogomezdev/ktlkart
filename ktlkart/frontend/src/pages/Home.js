import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import kart1 from '../assets/kart1.jpeg';
import kart2 from '../assets/kart2.jpeg';
import './Home.css';

const PRODUCT_ICONS = { tierra: '🏁', asfalto: '⚡', escuela: '🎯' };

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(() => {});
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__bg-fondo" />
          <div className="hero__bg-fondo2" />
          <div className="hero__bg-bandera" />
          <div className="hero__overlay" />
        </div>
        <div className="hero__inner">
          <div className="hero__content">
            <div className="hero__badge">🏎️ Fabricación Nacional · Style 2025</div>
            <h1 className="hero__title">
              Chasis de<br/>Karting
              <span className="hero__title-accent">de Alta Performance</span>
            </h1>
            <p className="hero__subtitle">
              Diseñados y fabricados para cada superficie y categoría. Tierra, Asfalto y Escuela.
              La tecnología que necesitás para ganar.
            </p>
            <div className="hero__actions">
              <Link to="/productos" className="btn btn-primary">Ver Chasis →</Link>
              <a href="https://wa.me/5493462597788?text=Hola! Quiero consultar sobre los chasis KTL." target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
            <div className="hero__stats">
              <div className="hero__stat"><span>3</span><p>Modelos</p></div>
              <div className="hero__stat"><span>100%</span><p>Nacional</p></div>
              <div className="hero__stat"><span>∞</span><p>Soporte</p></div>
            </div>
          </div>
          <div className="hero__kart">
            <div className="hero__kart-glow" />
            <img src={kart1} alt="KTL Kart 2025" className="hero__kart-img" />
          </div>
        </div>
      </section>

      {/* ── TICKER STRIP ── */}
      <div className="strip">
        <div className="strip__track">
          {['KTL Racing Kart','Fabricación Nacional','Chasis Tierra','Chasis Asfalto','Escuela de Karting','Alta Performance','Style 2025','Argentina',
            'KTL Racing Kart','Fabricación Nacional','Chasis Tierra','Chasis Asfalto','Escuela de Karting','Alta Performance','Style 2025','Argentina'
          ].map((item, i) => (
            <div key={i} className="strip__item"><span>⚡</span>{item}</div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section className="section about">
        <div className="about__bg-hex" />
        <div className="container">
          <div className="about__grid">
            <div className="about__text">
              <div className="about__label">¿Quiénes somos?</div>
              <h2 className="section-title">Pasión por el<br/>karting, <span style={{color:'var(--yellow)'}}>construida<br/>en acero</span></h2>
              <div className="yellow-line" />
              <p>En KTL Kart fabricamos chasis de karting con la más alta calidad y precisión. Cada chasis es diseñado y construido para ofrecer el máximo rendimiento en su categoría, utilizando materiales de primera y procesos de fabricación controlados.</p>
              <p>Nuestro compromiso es darte la herramienta que necesitás para competir al máximo nivel, con el respaldo de un equipo que entiende el karting desde adentro.</p>
              <Link to="/contacto" className="btn btn-primary" style={{marginTop:'24px',width:'fit-content'}}>Consultar ahora →</Link>
            </div>
            <div className="about__features">
              {[
                { icon: '🔧', title: 'Fabricación Nacional', desc: 'Todo fabricado en Argentina con control de calidad propio.' },
                { icon: '⚡', title: 'Alta Performance', desc: 'Geometría optimizada para cada tipo de superficie y categoría.' },
                { icon: '🏆', title: 'Para Competición', desc: 'Diseñados para ganar, desde karting escuela hasta competición.' },
                { icon: '🤝', title: 'Soporte Directo', desc: 'Atención personalizada del fabricante. Sin intermediarios.' },
              ].map((f) => (
                <div className="about__feature" key={f.title}>
                  <span className="about__feature-icon">{f.icon}</span>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── KART PHOTOS ── */}
      <section className="section kart-photos">
        <div className="kart-photos__bg-ray" />
        <div className="container">
          <div className="kart-photos__header">
            <p className="section-label" style={{justifyContent:'center'}}>Style 2025</p>
            <h2 className="section-title">El nuevo <span style={{color:'var(--yellow)'}}>KTL</span></h2>
            <p className="section-subtitle">Diseño renovado, performance comprobada en pista</p>
          </div>
          <div className="kart-photos__grid">
            <div className="kart-photo-card featured">
              <img src={kart1} alt="KTL Kart 2025 - Vista lateral" />
              <div className="kart-photo-card__overlay" />
              <div className="kart-photo-card__tag">Vista lateral</div>
            </div>
            <div className="kart-photo-card">
              <img src={kart2} alt="KTL Kart 2025 - Detalle frontal" />
              <div className="kart-photo-card__overlay" />
              <div className="kart-photo-card__tag">Detalle frontal</div>
            </div>
            <div className="kart-photo-card">
              <img src={kart1} alt="KTL Kart 2025 - Chasis" />
              <div className="kart-photo-card__overlay" />
              <div className="kart-photo-card__tag">Chasis 2025</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS PREVIEW ── */}
      <section className="section products-preview">
        <div className="products-preview__bg" />
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-label">Modelos</p>
              <h2 className="section-title">Nuestros <span style={{color:'var(--yellow)'}}>Chasis</span></h2>
              <p className="section-subtitle" style={{marginBottom:0}}>Tres modelos, una sola misión: hacerte ganar</p>
            </div>
            <Link to="/productos" className="btn btn-outline">Ver todos →</Link>
          </div>
          <div className="products-preview__grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-card__image">
                  {product.images?.length > 0 ? (
                    <img src={`https://ktlkart-backend.onrender.com${product.images[0]}`} alt={product.name} />
                  ) : (
                    <div className="product-card__placeholder">
                      <span>{PRODUCT_ICONS[product.category] || '🏎️'}</span>
                      <p>Fotos próximamente</p>
                    </div>
                  )}
                  <div className="product-card__category">{product.category}</div>
                </div>
                <div className="product-card__body">
                  <h3>{product.name}</h3>
                  <p>{product.tagline}</p>
                  <div className="product-card__specs">
                    {Object.entries(product.specs || {}).slice(0, 3).map(([k, v]) => (
                      <div key={k} className="product-card__spec">
                        <span>{k}</span><strong>{v}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="product-card__actions">
                    <Link to={`/productos/${product.id}`} className="btn btn-primary">Ver detalles</Link>
                    <a href={`https://wa.me/5493462597788?text=Hola! Me interesa el ${product.name}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">WhatsApp</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-box__bg" />
            <h2>¿Listo para <span>correr?</span></h2>
            <p>Consultanos por el modelo que más se adapta a tus necesidades. Respondemos rápido.</p>
            <div className="cta-box__actions">
              <Link to="/contacto" className="btn btn-primary">Hacer una consulta</Link>
              <a href="https://wa.me/5493462597788" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Escribir por WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
