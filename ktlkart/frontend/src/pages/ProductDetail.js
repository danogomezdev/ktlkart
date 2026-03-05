import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ContactForm from '../components/ContactForm';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImg(0);
    api.get(`/products/${id}`).then(async r => {
      const prod = r.data;
      setProduct(prod);
      const galRes = await api.get(`/gallery?product=${prod.category}`).catch(() => ({ data: [] }));
      const productImgs = (prod.images || []).map(url => ({ url, caption: '' }));
      const galleryImgs = galRes.data.map(g => ({ url: g.url, caption: g.caption || '' }));
      setAllImages([...productImgs, ...galleryImgs]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{paddingTop:'100px'}} className="loading"><div className="spinner" /></div>;
  if (!product) return (
    <div style={{paddingTop:'120px',textAlign:'center'}}>
      <h2>Producto no encontrado</h2>
      <Link to="/productos" className="btn btn-primary" style={{marginTop:'20px'}}>Volver</Link>
    </div>
  );

  const ICON = product.category === 'tierra' ? '🏁' : product.category === 'asfalto' ? '⚡' : '🎯';

  const prevImg = () => setSelectedImg(i => (i - 1 + allImages.length) % allImages.length);
  const nextImg = () => setSelectedImg(i => (i + 1) % allImages.length);

  return (
    <div className="product-detail">

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div className="detail-lightbox" onClick={() => setLightbox(null)}>
          <button className="detail-lightbox__close" onClick={() => setLightbox(null)}>✕</button>
          <button className="detail-lightbox__prev" onClick={e => { e.stopPropagation(); setLightbox(l => (l - 1 + allImages.length) % allImages.length); }}>‹</button>
          <div className="detail-lightbox__content" onClick={e => e.stopPropagation()}>
            <img src={`https://ktlkart-backend.onrender.com${allImages[lightbox].url}`} alt="" />
            {allImages[lightbox].caption && <p>{allImages[lightbox].caption}</p>}
            <span className="detail-lightbox__counter">{lightbox + 1} / {allImages.length}</span>
          </div>
          <button className="detail-lightbox__next" onClick={e => { e.stopPropagation(); setLightbox(l => (l + 1) % allImages.length); }}>›</button>
        </div>
      )}

      <div className="product-detail__hero">
        <div className="container">
          <div className="product-detail__breadcrumb">
            <Link to="/">Inicio</Link> › <Link to="/productos">Chasis</Link> › {product.name}
          </div>
          <div className="product-detail__main">

            {/* GALLERY */}
            <div className="product-detail__gallery">
              <div className="gallery__main" onClick={() => allImages.length > 0 && setLightbox(selectedImg)} style={{cursor: allImages.length > 0 ? 'zoom-in' : 'default'}}>
                {allImages.length > 0 ? (
                  <>
                    <img src={`https://ktlkart-backend.onrender.com${allImages[selectedImg].url}`} alt={product.name} />
                    <div className="gallery__zoom-hint">🔍 Ver en grande</div>
                    {allImages.length > 1 && (
                      <>
                        <button className="gallery__arrow gallery__arrow--prev" onClick={e => { e.stopPropagation(); prevImg(); }}>‹</button>
                        <button className="gallery__arrow gallery__arrow--next" onClick={e => { e.stopPropagation(); nextImg(); }}>›</button>
                        <div className="gallery__counter">{selectedImg + 1} / {allImages.length}</div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="gallery__placeholder">
                    <span style={{fontSize:'80px'}}>{ICON}</span>
                    <p>Fotos próximamente</p>
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="gallery__thumbs">
                  {allImages.map((img, i) => (
                    <button key={i} className={`gallery__thumb${selectedImg === i ? ' active' : ''}`} onClick={() => setSelectedImg(i)}>
                      <img src={`https://ktlkart-backend.onrender.com${img.url}`} alt={`${product.name} ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}

              {allImages.length > 0 && (
                <p className="gallery__info">📷 {allImages.length} foto{allImages.length !== 1 ? 's' : ''} · Hacé clic para ver en grande</p>
              )}
            </div>

            {/* INFO */}
            <div className="product-detail__info">
              <div className="product-detail__category">{product.category}</div>
              <h1>{product.name}</h1>
              <p className="product-detail__tagline">{product.tagline}</p>
              <p className="product-detail__desc">{product.description}</p>

              <div className="product-detail__specs">
                <h3>Especificaciones</h3>
                {Object.entries(product.specs || {}).map(([k, v]) => (
                  <div key={k} className="spec-row">
                    <span>{k}</span><strong>{v}</strong>
                  </div>
                ))}
              </div>

              <div className="product-detail__cta">
                <a
                  href={`https://wa.me/5493462597788?text=Hola! Me interesa el ${product.name}, quisiera hacer una consulta.`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Consultar por WhatsApp
                </a>
                <a href="#contacto-form" className="btn btn-outline">Enviar consulta</a>
              </div>

              <ul className="product-detail__features">
                {product.features?.map(f => <li key={f}><span>✓</span>{f}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT FORM */}
      <div id="contacto-form" className="section" style={{background:'var(--gray-100)'}}>
        <div className="container">
          <div style={{maxWidth:'700px', margin:'0 auto'}}>
            <h2 className="section-title" style={{textAlign:'center', marginBottom:'8px'}}>Hacer una consulta</h2>
            <p className="section-subtitle" style={{textAlign:'center'}}>Sobre el {product.name}</p>
            <ContactForm preselectedProduct={product.name} />
          </div>
        </div>
      </div>
    </div>
  );
}