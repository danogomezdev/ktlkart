import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../utils/api';
import kart1 from '../assets/kart1.jpeg';
import './ProductDetail.css';

const WA = 'https://wa.me/5493462597788';

// Precarga una imagen en background
const preloadImage = (src) => {
  const img = new Image();
  img.src = src;
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [imgLoading, setImgLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImg(0);
    getProduct(id)
      .then(d => {
        setProduct(d);
        setLoading(false);
        // Precargar todas las fotos en background apenas carga el producto
        if (d?.images?.length) {
          d.images.forEach(src => preloadImage(src));
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleThumbClick = useCallback((i) => {
    if (i === activeImg) return;
    setImgLoading(true);
    setActiveImg(i);
  }, [activeImg]);

  if (loading) return <div className="loading" style={{minHeight:'100vh'}}><div className="spinner"/></div>;
  if (!product) return <div className="loading" style={{minHeight:'100vh', color:'var(--gray-400)'}}><p>Producto no encontrado.</p></div>;

  const imgs = product.images?.length ? product.images : [kart1];

  return (
    <div className="product-detail">

      {/* HERO */}
      <div className="product-detail__hero">
        <div className="container">
          <Link to="/productos" className="product-detail__back">← Volver a Chasis</Link>
          <span className="product-detail__cat">{product.category?.toUpperCase()}</span>
          <h1 className="product-detail__title">{product.name}</h1>
          {product.tagline && <p className="product-detail__tagline">{product.tagline}</p>}
        </div>
      </div>

      {/* BODY */}
      <div className="container">
        <div className="product-detail__body">

          {/* GALERÍA */}
          <div className="product-detail__gallery">
            <div className={`gallery-main${imgLoading ? ' loading' : ''}`}>
              <img
                src={imgs[activeImg]}
                alt={`${product.name} - foto ${activeImg + 1}`}
                onLoad={() => setImgLoading(false)}
              />
              {imgLoading && <div className="gallery-main__spinner"><div className="spinner"/></div>}
            </div>
            {imgs.length > 1 && (
              <div className="gallery-thumbs">
                {imgs.map((img, i) => (
                  <div
                    key={i}
                    className={`gallery-thumb${activeImg === i ? ' active' : ''}`}
                    onClick={() => handleThumbClick(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="product-detail__info">
            <p className="product-detail__desc">{product.description}</p>

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="product-detail__specs">
                <h3>Especificaciones</h3>
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="detail-spec">
                    <span>{k}</span>
                    <strong>{v}</strong>
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
              <a href={`${WA}?text=Hola! Me interesa el ${product.name}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Consultar por WhatsApp →
              </a>
              <Link to="/contacto" className="btn btn-outline">Enviar consulta</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}