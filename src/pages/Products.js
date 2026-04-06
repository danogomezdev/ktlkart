import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../utils/api';
import kart1 from '../assets/kart1.jpeg';
import kart2 from '../assets/kart2.jpeg';
import './Products.css';

const WA = 'https://wa.me/5493462597788';
const FALLBACK_IMGS = [kart1, kart2, kart1];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getProducts().then(d => { setProducts(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="products-hero__inner container">
          <h1>Nuestros <span style={{color:'var(--yellow)'}}>Chasis</span></h1>
          <p>Tres líneas diseñadas para cada categoría del karting argentino</p>
        </div>
      </div>

      {loading && <div className="loading"><div className="spinner" /></div>}

      {!loading && (
        <div className="products-list">
          {products.map((p, i) => (
            <div key={p.id} className={`product-row${i % 2 !== 0 ? ' rev' : ''}`}>
              <div className="product-row__img">
                {p.images?.[0]
                  ? <img src={p.images[0]} alt={p.name} />
                  : <img src={FALLBACK_IMGS[i] || kart1} alt={p.name} />
                }
              </div>
              <div className="product-row__body">
                <span className="product-row__cat">{p.category.toUpperCase()}</span>
                <h2>{p.name}</h2>
                <p>{p.description}</p>
                <div className="product-row__specs">
                  {Object.entries(p.specs || {}).slice(0, 4).map(([k, v]) => (
                    <div key={k} className="product-spec">
                      <span>{k}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>
                <div className="product-row__actions">
                  <Link to={`/productos/${p.id}`} className="btn btn-primary">Ver detalles →</Link>
                  <a href={`${WA}?text=Hola! Me interesa el ${p.name}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">WhatsApp</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
