import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Products.css';

const ICONS = { tierra: '🏁', asfalto: '⚡', escuela: '🎯' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/products').then(r => { setProducts(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="container">
          <h1>Nuestros <span>Chasis</span></h1>
          <p>Tres modelos diseñados para cada superficie y categoría</p>
        </div>
      </div>

      <div className="section container">
        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : (
          <div className="products-list">
            {products.map((product, i) => (
              <div className={`product-row${i % 2 !== 0 ? ' product-row--reverse' : ''}`} key={product.id}>
                <div className="product-row__visual">
                  {product.images?.length > 0 ? (
                    <img src={`https://ktlkart-backend.onrender.com${product.images[0]}`} alt={product.name} />
                  ) : (
                    <div className="product-row__placeholder">
                      <span>{ICONS[product.category] || '🏎️'}</span>
                    </div>
                  )}
                  <div className="product-row__badge">{product.category}</div>
                </div>

                <div className="product-row__content">
                  <div className="product-row__label">Modelo {i + 1}</div>
                  <h2>{product.name}</h2>
                  <p className="product-row__tagline">{product.tagline}</p>
                  <p className="product-row__desc">{product.description}</p>

                  <ul className="product-row__features">
                    {product.features?.slice(0, 4).map(f => (
                      <li key={f}><span>✓</span>{f}</li>
                    ))}
                  </ul>

                  <div className="product-row__specs">
                    {Object.entries(product.specs || {}).map(([k, v]) => (
                      <div key={k} className="product-row__spec">
                        <span>{k}</span><strong>{v}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="product-row__actions">
                    <Link to={`/productos/${product.id}`} className="btn btn-primary">Ver más detalles</Link>
                    <a href={`https://wa.me/5493462597788?text=Hola! Me interesa el ${product.name}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Consultar por WhatsApp</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}