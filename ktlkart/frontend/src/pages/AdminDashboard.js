import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('gallery');
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('general');
  const [caption, setCaption] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [productPhotoTarget, setProductPhotoTarget] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState('todos');
  const fileRef = useRef();
  const productFileRef = useRef();

  useEffect(() => {
    if (!isAdmin) return;
    loadProducts();
    loadGallery();
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/admin/login" />;

  const loadProducts = () => api.get('/products').then(r => setProducts(r.data)).catch(() => {});
  const loadGallery = () => api.get('/gallery').then(r => setGallery(r.data)).catch(() => {});

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  // ── GALLERY ──
  const handleGalleryUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('images', f));
    fd.append('product', selectedProduct);
    fd.append('caption', caption);
    try {
      const r = await api.post('/gallery/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setGallery(g => [...g, ...r.data.items]);
      toast.success(`${r.data.items.length} foto(s) subida(s)!`);
      setCaption('');
    } catch { toast.error('Error al subir fotos'); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('¿Eliminar esta foto?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      setGallery(g => g.filter(i => String(i.id) !== String(id)));
      toast.success('Foto eliminada');
    } catch { toast.error('Error al eliminar'); }
  };

  // ── PRODUCT PHOTOS ──
  const handleProductPhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length || !productPhotoTarget) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('images', f));
    try {
      await api.post(`/gallery/product/${productPhotoTarget}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      await loadProducts();
      toast.success('Fotos del producto actualizadas!');
    } catch { toast.error('Error al subir foto'); }
    finally { setUploading(false); if (productFileRef.current) productFileRef.current.value = ''; }
  };

  // ── EDIT PRODUCT ──
  const startEdit = (product) => {
    setEditingProduct(product.id);
    setEditForm({
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      price: product.price || '',
      available: product.available,
      features: [...(product.features || [])],
      specs: { ...(product.specs || {}) },
      newFeature: '',
      newSpecKey: '',
      newSpecValue: '',
    });
  };

  const cancelEdit = () => { setEditingProduct(null); setEditForm(null); };

  const saveProduct = async (productId) => {
    try {
      const payload = {
        name: editForm.name,
        tagline: editForm.tagline,
        description: editForm.description,
        price: editForm.price || null,
        available: editForm.available,
        features: editForm.features,
        specs: editForm.specs,
      };
      await api.put(`/products/${productId}`, payload);
      await loadProducts();
      cancelEdit();
      toast.success('Producto actualizado!');
    } catch { toast.error('Error al guardar'); }
  };

  const addFeature = () => {
    if (!editForm.newFeature.trim()) return;
    setEditForm(f => ({ ...f, features: [...f.features, f.newFeature.trim()], newFeature: '' }));
  };
  const removeFeature = (i) => setEditForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  const addSpec = () => {
    if (!editForm.newSpecKey.trim() || !editForm.newSpecValue.trim()) return;
    setEditForm(f => ({ ...f, specs: { ...f.specs, [f.newSpecKey.trim()]: f.newSpecValue.trim() }, newSpecKey: '', newSpecValue: '' }));
  };
  const removeSpec = (key) => setEditForm(f => { const s = { ...f.specs }; delete s[key]; return { ...f, specs: s }; });

  const filteredGallery = galleryFilter === 'todos' ? gallery : gallery.filter(i => i.product === galleryFilter);

  const TABS = [
    { id: 'gallery', icon: '📷', label: 'Galería' },
    { id: 'products', icon: '🏎️', label: 'Productos' },
  ];

  return (
    <div className="admin">
      {/* SIDEBAR */}
      <aside className="admin__sidebar">
        <div className="admin__logo">KTL<span>KART</span></div>
        <nav className="admin__nav">
          {TABS.map(t => (
            <button key={t.id} className={`admin__nav-item${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
              <span className="nav-icon">{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <div className="admin__sidebar-footer">
          <span>👤 {user?.username}</span>
          <button onClick={handleLogout} className="admin__logout">Salir</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin__main">
        <header className="admin__header">
          <h1>{tab === 'gallery' ? '📷 Gestión de Galería' : '🏎️ Gestión de Productos'}</h1>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{fontSize:'13px'}}>Ver sitio →</a>
        </header>

        {/* ══ GALLERY TAB ══ */}
        {tab === 'gallery' && (
          <div className="admin__content">
            <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleGalleryUpload} style={{display:'none'}} />

            {/* Upload card */}
            <div className="admin__card">
              <h2>Subir fotos</h2>
              <div className="upload-form">
                <div className="form-group">
                  <label>Categoría</label>
                  <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                    <option value="general">General</option>
                    <option value="tierra">KTL Tierra</option>
                    <option value="asfalto">KTL Asfalto</option>
                    <option value="escuela">KTL Escuela</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Descripción (opcional)</label>
                  <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Descripción breve..." />
                </div>
                <div className="upload-drop" onClick={() => fileRef.current?.click()}>
                  <span>{uploading ? '⏳' : '📁'}</span>
                  <p>{uploading ? 'Subiendo fotos...' : 'Hacé clic para seleccionar fotos'}</p>
                  <small>JPG, PNG, WEBP · Máx. 10MB por foto · Podés subir varias a la vez</small>
                </div>
              </div>
            </div>

            {/* Gallery grid */}
            <div className="admin__card">
              <div className="admin__card-header">
                <h2>Fotos ({gallery.length})</h2>
                <div className="gallery-filters-admin">
                  {['todos','general','tierra','asfalto','escuela'].map(f => (
                    <button key={f} className={`filter-chip${galleryFilter === f ? ' active' : ''}`} onClick={() => setGalleryFilter(f)}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {filteredGallery.length === 0 ? (
                <div className="admin__empty">📷 No hay fotos en esta categoría aún</div>
              ) : (
                <div className="admin__gallery-grid">
                  {filteredGallery.map(img => (
                    <div key={img.id} className="admin__gallery-item">
                      <img src={`https://ktlkart-backend.onrender.com${img.url}`} alt={img.caption || ''} />
                      <div className="admin__gallery-overlay">
                        <span className="admin__gallery-tag">{img.product}</span>
                        <button onClick={() => handleDeleteGallery(img.id)} className="admin__delete-btn" title="Eliminar">🗑️</button>
                      </div>
                      {img.caption && <div className="admin__gallery-caption">{img.caption}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ PRODUCTS TAB ══ */}
        {tab === 'products' && (
          <div className="admin__content">
            <input ref={productFileRef} type="file" multiple accept="image/*" onChange={handleProductPhotoUpload} style={{display:'none'}} />

            {products.map(product => (
              <div key={product.id} className="admin__card">
                {/* Product header */}
                <div className="admin__product-header">
                  <div className="admin__product-info">
                    <span className="admin__product-tag">{product.category}</span>
                    <h2>{product.name}</h2>
                    <p>{product.tagline}</p>
                  </div>
                  <div className="admin__product-actions">
                    <button
                      className="btn btn-outline"
                      style={{fontSize:'13px'}}
                      onClick={() => { setProductPhotoTarget(product.id); setTimeout(() => productFileRef.current?.click(), 100); }}
                    >
                      📷 Agregar fotos
                    </button>
                    {editingProduct === product.id ? (
                      <button className="btn btn-outline" style={{fontSize:'13px'}} onClick={cancelEdit}>✕ Cancelar</button>
                    ) : (
                      <button className="btn btn-primary" style={{fontSize:'13px'}} onClick={() => startEdit(product)}>✏️ Editar producto</button>
                    )}
                  </div>
                </div>

                {/* Product images */}
                <div className="admin__product-images">
                  {!product.images?.length ? (
                    <span className="admin__empty-small">Sin fotos aún</span>
                  ) : product.images.map((img, i) => (
                    <div key={i} className="admin__product-img">
                      <img src={`https://ktlkart-backend.onrender.com${img}`} alt={`${product.name} ${i+1}`} />
                      {i === 0 && <span className="admin__img-badge">Principal</span>}
                    </div>
                  ))}
                </div>

                {/* ── EDIT FORM ── */}
                {editingProduct === product.id && editForm && (
                  <div className="edit-form">
                    <div className="edit-form__divider"><span>✏️ Editando producto</span></div>

                    {/* Basic info */}
                    <div className="edit-section">
                      <h3 className="edit-section__title">Información básica</h3>
                      <div className="edit-grid-2">
                        <div className="form-group">
                          <label>Nombre del modelo</label>
                          <input value={editForm.name} onChange={e => setEditForm(f => ({...f, name: e.target.value}))} />
                        </div>
                        <div className="form-group">
                          <label>Tagline (frase corta)</label>
                          <input value={editForm.tagline} onChange={e => setEditForm(f => ({...f, tagline: e.target.value}))} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Descripción completa</label>
                        <textarea value={editForm.description} onChange={e => setEditForm(f => ({...f, description: e.target.value}))} rows={4} />
                      </div>
                      <div className="edit-grid-2">
                        <div className="form-group">
                          <label>Precio (dejar vacío para no mostrar)</label>
                          <input value={editForm.price} onChange={e => setEditForm(f => ({...f, price: e.target.value}))} placeholder="Ej: $2.500.000" />
                        </div>
                        <div className="form-group">
                          <label>Disponibilidad</label>
                          <select value={editForm.available} onChange={e => setEditForm(f => ({...f, available: e.target.value === 'true'}))}>
                            <option value="true">Disponible</option>
                            <option value="false">No disponible</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="edit-section">
                      <h3 className="edit-section__title">Características</h3>
                      <div className="edit-tags">
                        {editForm.features.map((f, i) => (
                          <div key={i} className="edit-tag">
                            <span>{f}</span>
                            <button onClick={() => removeFeature(i)}>✕</button>
                          </div>
                        ))}
                      </div>
                      <div className="edit-add-row">
                        <input
                          value={editForm.newFeature}
                          onChange={e => setEditForm(f => ({...f, newFeature: e.target.value}))}
                          placeholder="Nueva característica..."
                          onKeyDown={e => e.key === 'Enter' && addFeature()}
                        />
                        <button className="btn btn-primary" onClick={addFeature} style={{fontSize:'13px', whiteSpace:'nowrap'}}>+ Agregar</button>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="edit-section">
                      <h3 className="edit-section__title">Especificaciones técnicas</h3>
                      <div className="edit-specs-list">
                        {Object.entries(editForm.specs).map(([k, v]) => (
                          <div key={k} className="edit-spec-row">
                            <input value={k} onChange={e => {
                              const newSpecs = {};
                              Object.entries(editForm.specs).forEach(([sk, sv]) => { newSpecs[sk === k ? e.target.value : sk] = sv; });
                              setEditForm(f => ({...f, specs: newSpecs}));
                            }} className="spec-key-input" />
                            <input value={v} onChange={e => setEditForm(f => ({...f, specs: {...f.specs, [k]: e.target.value}}))} className="spec-val-input" />
                            <button className="spec-del-btn" onClick={() => removeSpec(k)}>🗑️</button>
                          </div>
                        ))}
                      </div>
                      <div className="edit-add-row">
                        <input value={editForm.newSpecKey} onChange={e => setEditForm(f => ({...f, newSpecKey: e.target.value}))} placeholder="Nombre (ej: Motor)" style={{flex:'0 0 180px'}} />
                        <input value={editForm.newSpecValue} onChange={e => setEditForm(f => ({...f, newSpecValue: e.target.value}))} placeholder="Valor (ej: Rotax Max)" onKeyDown={e => e.key === 'Enter' && addSpec()} />
                        <button className="btn btn-primary" onClick={addSpec} style={{fontSize:'13px', whiteSpace:'nowrap'}}>+ Agregar</button>
                      </div>
                    </div>

                    {/* Save button */}
                    <div className="edit-form__footer">
                      <button className="btn btn-outline" onClick={cancelEdit}>Cancelar</button>
                      <button className="btn btn-primary" style={{padding:'14px 32px'}} onClick={() => saveProduct(product.id)}>
                        💾 Guardar cambios
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
