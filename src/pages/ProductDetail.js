import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../utils/api';
import { getMainUrl, getThumbUrl } from '../utils/imgUtils';
import kart1 from '../assets/kart1.jpeg';
import './ProductDetail.css';

const WA = 'https://wa.me/5493462597788';
const THUMBS_INITIAL = 6;

const preloadImage = (src) => { const img = new Image(); img.src = src; };

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [imgLoading, setImgLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAllThumbs, setShowAllThumbs] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImg(0);
    setShowAllThumbs(false);
    getProduct(id)
      .then(d => {
        setProduct(d);
        setLoading(false);
        if (d?.images?.length) {
          d.images.slice(0, 6).forEach(src => preloadImage(getMainUrl(src)));
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleThumbClick = useCallback((i) => {
    if (i === activeImg) return;
    setImgLoading(true);
    setActiveImg(i);
  }, [activeImg]);

  // Navegar con flechas
  const handlePrev = () => {
    if (!imgs) return;
    setImgLoading(true);
    setActiveImg(i => (i - 1 + imgs.length) % imgs.length);
  };
  const handleNext = () => {
    if (!imgs) return;
    setImgLoading(true);
    setActiveImg(i => (i + 1) % imgs.length);
  };

  if (loading) return <div className="loading" style={{minHeight:'100vh'}}><div className="spinner"/></div>;
  if (!product) return <div className="loading" style={{minHeight:'100vh', color:'var(--gray-400)'}}><p>Producto no encontrado.</p></div>;

  const imgs = product.images?.length ? product.images : [kart1];
  const visibleThumbs = showAllThumbs ? imgs : imgs.slice(0, THUMBS_INITIAL);
  const hasMore = imgs.length > THUMBS_INITIAL && !showAllThumbs;

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

      <div className="container">
        <div className="product-detail__body">

          {/* GALERÍA */}
          <div className="product-detail__gallery">
            {/* Imagen principal + flechas */}
            <div className={`gallery-main${imgLoading ? ' loading' : ''}`}>
              <img
                src={getMainUrl(imgs[activeImg])}
                alt={`${product.name} - foto ${activeImg + 1}`}
                onLoad={() => setImgLoading(false)}
              />
              {imgLoading && <div className="gallery-main__spinner"><div className="spinner"/></div>}
              {/* Flechas de navegación */}
              {imgs.length > 1 && (
                <>
                  <button className="gallery-nav gallery-nav--prev" onClick={handlePrev}>‹</button>
                  <button className="gallery-nav gallery-nav--next" onClick={handleNext}>›</button>
                  <div className="gallery-counter">{activeImg + 1} / {imgs.length}</div>
                </>
              )}
            </div>

            {/* Thumbnails — máx 6 + botón ver más */}
            {imgs.length > 1 && (
              <div className="gallery-thumbs-wrap">
                <div className="gallery-thumbs">
                  {visibleThumbs.map((img, i) => (
                    <div
                      key={i}
                      className={`gallery-thumb${activeImg === i ? ' active' : ''}`}
                      onClick={() => handleThumbClick(i)}
                    >
                      <img src={getThumbUrl(img)} alt={`${product.name} ${i + 1}`} loading="lazy" />
                    </div>
                  ))}
                  {hasMore && (
                    <div className="gallery-thumb gallery-thumb--more" onClick={() => setShowAllThumbs(true)}>
                      <span>+{imgs.length - THUMBS_INITIAL}</span>
                    </div>
                  )}
                </div>
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
                    <span>{k}</span><strong>{v}</strong>
                  </div>
                ))}
              </div>
            )}

            {product.features?.length > 0 && (
              <div className="product-detail__features">
                <h3>Características</h3>
                <ul>{product.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
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
