import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Products.css';

const PRODUCT_ICONS = { tierra: '🏁', asfalto: '⚡', escuela: '🎯' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/products').then(r => { setProducts(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="products-hero__bg" />
        <div className="products-hero__overlay" />
        <div className="container products-hero__inner">
          <p className="section-label">Catálogo</p>
          <h1 className="section-title">Nuestros <span>Chasis</span></h1>
          <p className="section-subtitle">Fabricados para cada superficie. Elegí tu categoría.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? <div className="loading"><div className="spinner"/></div> : (
            <div className="products-grid">
              {products.map((p, i) => (
                <div key={p.id} className={`product-row${i % 2 === 1 ? ' reversed' : ''}`}>
                  <div className="product-row__img">
                    {p.images?.length > 0
                      ? <img src={`https://ktlkart-backend.onrender.com${p.images[0]}`} alt={p.name}/>
                      : <div className="product-row__placeholder"><span>{PRODUCT_ICONS[p.category]||'🏎️'}</span></div>
                    }
                  </div>
                  <div className="product-row__body">
                    <div className="product-row__cat">{p.category}</div>
                    <h2>{p.name}</h2>
                    <p>{p.description}</p>
                    {p.specs && (
                      <div className="product-row__specs">
                        {Object.entries(p.specs).slice(0,4).map(([k,v]) => (
                          <div key={k} className="product-row__spec">
                            <span>{k}</span><strong>{v}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="product-row__actions">
                      <Link to={`/productos/${p.id}`} className="btn btn-primary">Ver detalles →</Link>
                      <a href={`https://wa.me/5493462597788?text=Hola! Me interesa el ${p.name}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">WhatsApp</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
