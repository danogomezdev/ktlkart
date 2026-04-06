import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../utils/api';
import kart1 from '../assets/kart1.jpeg';
import './ProductDetail.css';

const WA = 'https://wa.me/5493462597788';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getProduct(id)
      .then(d => { setProduct(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading" style={{minHeight:'100vh'}}><div className="spinner"/></div>;
  if (!product) return <div className="loading" style={{minHeight:'100vh'}}><p>Producto no encontrado.</p></div>;

  const imgs = product.images?.length ? product.images : [kart1];

  return (
    <div className="product-detail">
      <div className="product-detail__hero">
        <div className="container">
          <Link to="/productos" className="product-detail__back">← Volver a Chasis</Link>
          <span className="product-detail__cat">{product.category?.toUpperCase()}</span>
          <h1 className="product-detail__title">{product.name}</h1>
          {product.tagline && <p className="product-detail__tagline">{product.tagline}</p>}
        </div>
      </div>

      <div className="section container">
        <div className="product-detail__grid">
          {/* Galería */}
          <div className="product-detail__gallery">
            <div className="gallery-main">
              <img src={imgs[activeImg]} alt={product.name} />
            </div>
            {imgs.length > 1 && (
              <div className="gallery-thumbs">
                {imgs.map((img, i) => (
                  <div key={i} className={`gallery-thumb${activeImg === i ? ' active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            <p className="product-detail__desc">{product.description}</p>

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="product-detail__specs">
                <h3>Especificaciones</h3>
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="detail-spec">
                    <span>{k}</span><strong>{v}</strong>
                  </div>
                ))}
              </div>
            )}

            {product.features?.length > 0 && (
              <div className="product-detail__features">
                <h3>Características</h3>
                <ul>
                  {product.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}

            {product.price && <div className="product-detail__price">{product.price}</div>}

            <div className="product-detail__actions">
              <a href={`${WA}?text=Hola! Me interesa el ${product.name}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Consultar por WhatsApp →</a>
              <Link to="/contacto" className="btn btn-outline">Enviar consulta</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
