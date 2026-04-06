import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { supabase, supabaseAdmin } from '../lib/supabase';
import './AdminDashboard.css';

const CATEGORIES = ['general', 'tierra', 'asfalto', 'escuela'];

export default function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('gallery');

  // Gallery state
  const [gallery, setGallery] = useState([]);
  const [galleryFilter, setGalleryFilter] = useState('todos');
  const [uploading, setUploading] = useState(false);
  const [selectedCat, setSelectedCat] = useState('general');
  const [caption, setCaption] = useState('');
  const fileRef = useRef();

  // Products state
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [productFileRef] = useState(React.createRef());
  const [productPhotoTarget, setProductPhotoTarget] = useState(null);
  const [uploadingProductId, setUploadingProductId] = useState(null);

  // Contacts state
  const [contacts, setContacts] = useState([]);
  const [contactFilter, setContactFilter] = useState('todos');

  useEffect(() => {
    if (!isAdmin) return;
    loadGallery();
    loadProducts();
    loadContacts();
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/admin/login" />;

  // ── LOADERS ──
  const loadGallery = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    setGallery(data || []);
  };
  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id');
    setProducts(data || []);
  };
  const loadContacts = async () => {
    const { data } = await supabaseAdmin.from('contacts').select('*').order('created_at', { ascending: false });
    setContacts(data || []);
  };

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  // ── GALLERY UPLOAD ──
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const ext = file.name.split('.').pop();
        const path = `gallery/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabaseAdmin.storage.from('gallery').upload(path, file);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabaseAdmin.storage.from('gallery').getPublicUrl(path);
        await supabaseAdmin.from('gallery').insert({ url: publicUrl, storage_path: path, product: selectedCat, caption });
      }
      toast.success(`${files.length} foto(s) subida(s)!`);
      setCaption('');
      loadGallery();
    } catch { toast.error('Error al subir fotos'); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const handleDeleteGallery = async (img) => {
    if (!window.confirm('¿Eliminar esta foto?')) return;
    try {
      await supabaseAdmin.storage.from('gallery').remove([img.storage_path]);
      await supabaseAdmin.from('gallery').delete().eq('id', img.id);
      setGallery(g => g.filter(i => i.id !== img.id));
      toast.success('Foto eliminada');
    } catch { toast.error('Error al eliminar'); }
  };

  // ── PRODUCT PHOTO UPLOAD ──
  const handleProductPhoto = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !productPhotoTarget) return;
    setUploadingProductId(productPhotoTarget);
    try {
      const newUrls = [];
      for (const file of files) {
        const ext = file.name.split('.').pop();
        const path = `products/${productPhotoTarget}_${Date.now()}.${ext}`;
        const { error: upErr } = await supabaseAdmin.storage.from('products').upload(path, file);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabaseAdmin.storage.from('products').getPublicUrl(path);
        newUrls.push(publicUrl);
      }
      const product = products.find(p => p.id === productPhotoTarget);
      const updatedImages = [...(product.images || []), ...newUrls];
      await supabaseAdmin.from('products').update({ images: updatedImages }).eq('id', productPhotoTarget);
      loadProducts();
      toast.success('Fotos del producto actualizadas!');
    } catch { toast.error('Error al subir foto'); }
    finally { setUploadingProductId(null); if (productFileRef.current) productFileRef.current.value = ''; }
  };

  // ── EDIT PRODUCT ──
  const startEdit = (p) => {
    setEditingId(p.id);
    setEditForm({ name: p.name, tagline: p.tagline || '', description: p.description || '',
      price: p.price || '', available: p.available,
      features: [...(p.features || [])], specs: { ...(p.specs || {}) },
      newFeature: '', newSpecKey: '', newSpecValue: '' });
  };
  const cancelEdit = () => { setEditingId(null); setEditForm(null); };

  const saveProduct = async (id) => {
    try {
      await supabaseAdmin.from('products').update({
        name: editForm.name, tagline: editForm.tagline, description: editForm.description,
        price: editForm.price || null, available: editForm.available,
        features: editForm.features, specs: editForm.specs,
      }).eq('id', id);
      loadProducts(); cancelEdit();
      toast.success('Producto actualizado!');
    } catch { toast.error('Error al guardar'); }
  };

  const addFeature = () => { if (!editForm.newFeature.trim()) return; setEditForm(f => ({ ...f, features: [...f.features, f.newFeature.trim()], newFeature: '' })); };
  const removeFeature = (i) => setEditForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));
  const addSpec = () => { if (!editForm.newSpecKey.trim() || !editForm.newSpecValue.trim()) return; setEditForm(f => ({ ...f, specs: { ...f.specs, [f.newSpecKey.trim()]: f.newSpecValue.trim() }, newSpecKey: '', newSpecValue: '' })); };
  const removeSpec = (key) => setEditForm(f => { const s = { ...f.specs }; delete s[key]; return { ...f, specs: s }; });

  // ── CONTACTS ──
  const markRead = async (id) => {
    await supabaseAdmin.from('contacts').update({ read: true }).eq('id', id);
    setContacts(c => c.map(x => x.id === id ? { ...x, read: true } : x));
  };
  const deleteContact = async (id) => {
    if (!window.confirm('¿Eliminar esta consulta?')) return;
    await supabaseAdmin.from('contacts').delete().eq('id', id);
    setContacts(c => c.filter(x => x.id !== id));
    toast.success('Consulta eliminada');
  };

  const filteredGallery = galleryFilter === 'todos' ? gallery : gallery.filter(i => i.product === galleryFilter);
  const filteredContacts = contactFilter === 'todos' ? contacts : contactFilter === 'no-leidas' ? contacts.filter(c => !c.read) : contacts.filter(c => c.read);
  const unread = contacts.filter(c => !c.read).length;

  const TABS = [
    { id: 'gallery', icon: '📷', label: 'Galería' },
    { id: 'products', icon: '🏎️', label: 'Productos' },
    { id: 'contacts', icon: '📩', label: `Consultas${unread > 0 ? ` (${unread})` : ''}` },
  ];

  return (
    <div className="admin">
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
          <span>👤 {user?.email}</span>
          <button onClick={handleLogout} className="admin__logout">Salir</button>
        </div>
      </aside>

      <main className="admin__main">
        <header className="admin__header">
          <h1>{TABS.find(t => t.id === tab)?.icon} {tab === 'gallery' ? 'Galería' : tab === 'products' ? 'Productos' : 'Consultas'}</h1>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{fontSize:'13px'}}>Ver sitio →</a>
        </header>

        {/* ══ GALLERY ══ */}
        {tab === 'gallery' && (
          <div className="admin__content">
            <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleGalleryUpload} style={{display:'none'}} />
            <div className="admin__card">
              <h2>Subir fotos</h2>
              <div className="upload-form">
                <div className="form-group">
                  <label>Categoría</label>
                  <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Descripción (opcional)</label>
                  <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Descripción breve..." />
                </div>
                <div className="upload-drop" onClick={() => fileRef.current?.click()}>
                  <span>{uploading ? '⏳' : '📁'}</span>
                  <p>{uploading ? 'Subiendo fotos...' : 'Hacé clic para seleccionar fotos'}</p>
                  <small>JPG, PNG, WEBP · Podés subir varias a la vez</small>
                </div>
              </div>
            </div>
            <div className="admin__card">
              <div className="admin__card-header">
                <h2>Fotos ({gallery.length})</h2>
                <div className="gallery-filters-admin">
                  {['todos', ...CATEGORIES].map(f => (
                    <button key={f} className={`filter-chip${galleryFilter === f ? ' active' : ''}`} onClick={() => setGalleryFilter(f)}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {filteredGallery.length === 0
                ? <div className="admin__empty">📷 No hay fotos en esta categoría aún</div>
                : <div className="admin__gallery-grid">
                    {filteredGallery.map(img => (
                      <div key={img.id} className="admin__gallery-item">
                        <img src={img.url} alt={img.caption || ''} />
                        <div className="admin__gallery-overlay">
                          <span className="admin__gallery-tag">{img.product}</span>
                          <button onClick={() => handleDeleteGallery(img)} className="admin__delete-btn" title="Eliminar">🗑️</button>
                        </div>
                        {img.caption && <div className="admin__gallery-caption">{img.caption}</div>}
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}

        {/* ══ PRODUCTS ══ */}
        {tab === 'products' && (
          <div className="admin__content">
            <input ref={productFileRef} type="file" multiple accept="image/*" onChange={handleProductPhoto} style={{display:'none'}} />
            {products.map(product => (
              <div key={product.id} className="admin__card">
                <div className="admin__product-header">
                  <div className="admin__product-info">
                    <span className="admin__product-tag">{product.category}</span>
                    <h2>{product.name}</h2>
                    <p>{product.tagline}</p>
                  </div>
                  <div className="admin__product-actions">
                    <button className="btn btn-outline" style={{fontSize:'13px'}}
                      onClick={() => { setProductPhotoTarget(product.id); setTimeout(() => productFileRef.current?.click(), 100); }}>
                      {uploadingProductId === product.id ? '⏳ Subiendo...' : '📷 Agregar fotos'}
                    </button>
                    {editingId === product.id
                      ? <button className="btn btn-outline" style={{fontSize:'13px'}} onClick={cancelEdit}>✕ Cancelar</button>
                      : <button className="btn btn-primary" style={{fontSize:'13px'}} onClick={() => startEdit(product)}>✏️ Editar</button>
                    }
                  </div>
                </div>

                <div className="admin__product-images">
                  {!product.images?.length
                    ? <span className="admin__empty-small">Sin fotos aún</span>
                    : product.images.map((img, i) => (
                        <div key={i} className="admin__product-img">
                          <img src={img} alt={`${product.name} ${i+1}`} />
                          {i === 0 && <span className="admin__img-badge">Principal</span>}
                        </div>
                      ))
                  }
                </div>

                {editingId === product.id && editForm && (
                  <div className="edit-form">
                    <div className="edit-form__divider"><span>✏️ Editando producto</span></div>
                    <div className="edit-section">
                      <h3 className="edit-section__title">Información básica</h3>
                      <div className="edit-grid-2">
                        <div className="form-group"><label>Nombre</label><input value={editForm.name} onChange={e => setEditForm(f => ({...f, name: e.target.value}))} /></div>
                        <div className="form-group"><label>Tagline</label><input value={editForm.tagline} onChange={e => setEditForm(f => ({...f, tagline: e.target.value}))} /></div>
                      </div>
                      <div className="form-group"><label>Descripción</label><textarea value={editForm.description} onChange={e => setEditForm(f => ({...f, description: e.target.value}))} rows={4} /></div>
                      <div className="edit-grid-2">
                        <div className="form-group"><label>Precio (opcional)</label><input value={editForm.price} onChange={e => setEditForm(f => ({...f, price: e.target.value}))} placeholder="Ej: $2.500.000" /></div>
                        <div className="form-group"><label>Disponibilidad</label>
                          <select value={editForm.available} onChange={e => setEditForm(f => ({...f, available: e.target.value === 'true'}))}>
                            <option value="true">Disponible</option><option value="false">No disponible</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="edit-section">
                      <h3 className="edit-section__title">Características</h3>
                      <div className="edit-tags">
                        {editForm.features.map((f, i) => (
                          <div key={i} className="edit-tag"><span>{f}</span><button onClick={() => removeFeature(i)}>✕</button></div>
                        ))}
                      </div>
                      <div className="edit-add-row">
                        <input value={editForm.newFeature} onChange={e => setEditForm(f => ({...f, newFeature: e.target.value}))} placeholder="Nueva característica..." onKeyDown={e => e.key === 'Enter' && addFeature()} />
                        <button className="btn btn-primary" onClick={addFeature} style={{fontSize:'13px'}}>+ Agregar</button>
                      </div>
                    </div>
                    <div className="edit-section">
                      <h3 className="edit-section__title">Especificaciones</h3>
                      <div className="edit-specs-list">
                        {Object.entries(editForm.specs).map(([k, v]) => (
                          <div key={k} className="edit-spec-row">
                            <input value={k} onChange={e => { const s = {}; Object.entries(editForm.specs).forEach(([sk,sv]) => { s[sk===k?e.target.value:sk]=sv; }); setEditForm(f=>({...f,specs:s})); }} className="spec-key-input"/>
                            <input value={v} onChange={e => setEditForm(f => ({...f, specs:{...f.specs,[k]:e.target.value}}))} className="spec-val-input"/>
                            <button className="spec-del-btn" onClick={() => removeSpec(k)}>🗑️</button>
                          </div>
                        ))}
                      </div>
                      <div className="edit-add-row">
                        <input value={editForm.newSpecKey} onChange={e => setEditForm(f => ({...f, newSpecKey: e.target.value}))} placeholder="Nombre (ej: Motor)" style={{flex:'0 0 180px'}}/>
                        <input value={editForm.newSpecValue} onChange={e => setEditForm(f => ({...f, newSpecValue: e.target.value}))} placeholder="Valor (ej: Rotax Max)" onKeyDown={e => e.key==='Enter'&&addSpec()}/>
                        <button className="btn btn-primary" onClick={addSpec} style={{fontSize:'13px'}}>+ Agregar</button>
                      </div>
                    </div>
                    <div className="edit-form__footer">
                      <button className="btn btn-outline" onClick={cancelEdit}>Cancelar</button>
                      <button className="btn btn-primary" style={{padding:'14px 32px'}} onClick={() => saveProduct(product.id)}>💾 Guardar</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ══ CONTACTS ══ */}
        {tab === 'contacts' && (
          <div className="admin__content">
            <div className="admin__card">
              <div className="admin__card-header">
                <h2>Consultas recibidas ({contacts.length})</h2>
                <div className="gallery-filters-admin">
                  {[['todos','Todas'],['no-leidas','No leídas'],['leidas','Leídas']].map(([v,l]) => (
                    <button key={v} className={`filter-chip${contactFilter===v?' active':''}`} onClick={() => setContactFilter(v)}>{l}</button>
                  ))}
                </div>
              </div>
              {filteredContacts.length === 0
                ? <div className="admin__empty">📩 No hay consultas{contactFilter!=='todos'?' en esta categoría':''} aún</div>
                : <div className="contacts-list">
                    {filteredContacts.map(c => (
                      <div key={c.id} className={`contact-item${c.read ? ' read' : ' unread'}`}>
                        <div className="contact-item__header">
                          <div className="contact-item__meta">
                            {!c.read && <span className="contact-item__badge">NUEVO</span>}
                            <strong className="contact-item__name">{c.name}</strong>
                            {c.subject && <span className="contact-item__subject">— {c.subject}</span>}
                          </div>
                          <div className="contact-item__actions">
                            <span className="contact-item__date">{new Date(c.created_at).toLocaleDateString('es-AR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}</span>
                            {!c.read && <button className="btn btn-outline" style={{fontSize:'12px',padding:'6px 12px'}} onClick={() => markRead(c.id)}>✓ Marcar leída</button>}
                            <button className="admin__delete-btn" onClick={() => deleteContact(c.id)} title="Eliminar">🗑️</button>
                          </div>
                        </div>
                        <div className="contact-item__body">
                          <p className="contact-item__message">{c.message}</p>
                          <div className="contact-item__data">
                            {c.email && <a href={`mailto:${c.email}`} className="contact-item__link">✉️ {c.email}</a>}
                            {c.phone && <a href={`https://wa.me/${c.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="contact-item__link">📱 {c.phone}</a>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
