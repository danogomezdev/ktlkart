import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import kart1 from '../assets/kart1.jpeg';
import kart2 from '../assets/kart2.jpeg';
import './Products.css';

const API_URL = 'https://ktlkart-backend.onrender.com';
const WA = 'https://wa.me/5493462597788';
const ICONS = { tierra:'🏁', asfalto:'⚡', escuela:'🎯' };

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
        <div className="products-hero__inner">
          <h1>Style 2025</h1>
          <p>Chasis de karting de alta performance · Fabricación nacional</p>
        </div>
      </section>

      {loading ? <div className="loading"><div className="spinner"/></div> : (
        <div className="products-list">
          {products.map((p, i) => (
            <div key={p.id} className={`product-row${i % 2 === 1 ? ' rev' : ''}`}>
              <div className="product-row__img">
                {p.images?.length > 0
                  ? <img src={`${API_URL}${p.images[0]}`} alt={p.name}/>
                  : <div className="product-row__placeholder">{ICONS[p.category]||'🏎️'}</div>
                }
              </div>
              <div className="product-row__body">
                <div className="product-row__cat">{p.category}</div>
                <h2>{p.name}</h2>
                <p>{p.description}</p>
                {p.specs && (
                  <div className="product-row__specs">
                    {Object.entries(p.specs).slice(0,4).map(([k,v]) => (
                      <div key={k} className="product-spec"><span>{k}</span><strong>{v}</strong></div>
                    ))}
                  </div>
                )}
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
