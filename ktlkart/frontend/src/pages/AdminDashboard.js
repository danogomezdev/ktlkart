import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './AdminDashboard.css';

const API = process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5001';

export default function AdminDashboard() {
  const { user, logout, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [editingSettings, setEditingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({});
  const [projectForm, setProjectForm] = useState({});
  const [serviceForm, setServiceForm] = useState({});
  const [testimonialForm, setTestimonialForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const avatarRef = useRef();

  useEffect(() => { if (isAdmin) loadAll(); }, [isAdmin]);

  if (authLoading) return <div className="loading"><div className="spinner"/></div>;
  if (!isAdmin) return <Navigate to="/admin/login" />;

  const loadAll = () => {
    api.get('/projects').then(r => setProjects(r.data)).catch(()=>{});
    api.get('/services').then(r => setServices(r.data)).catch(()=>{});
    api.get('/testimonials').then(r => setTestimonials(r.data)).catch(()=>{});
    api.get('/messages').then(r => setMessages(r.data)).catch(()=>{});
    api.get('/settings').then(r => setSettings(r.data)).catch(()=>{});
  };

  const unread = messages.filter(m => !m.read).length;

  // ── PROJECTS ──
  const startNewProject = () => { setEditingProject('new'); setProjectForm({ title:'', titleEn:'', slug:'', category:'Web App', description:'', descriptionEn:'', tech:[], liveUrl:'', repoUrl:'', featured: false, status:'published', newTech:'' }); };
  const startEditProject = (p) => { setEditingProject(p.id); setProjectForm({ ...p, tech: [...(p.tech||[])], newTech:'' }); };
  const saveProject = async () => {
    try {
      const { newTech, ...payload } = projectForm;
      if (editingProject === 'new') { await api.post('/projects', payload); toast.success('Proyecto creado!'); }
      else { await api.put(`/projects/${editingProject}`, payload); toast.success('Proyecto actualizado!'); }
      setEditingProject(null); loadAll();
    } catch { toast.error('Error al guardar'); }
  };
  const deleteProject = async (id) => { if (!window.confirm('¿Eliminar?')) return; await api.delete(`/projects/${id}`); loadAll(); toast.success('Eliminado'); };
  const uploadProjectImages = async (e, projectId) => {
    const files = e.target.files; if (!files?.length) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('images', f));
    try { await api.post(`/projects/${projectId}/images`, fd, { headers:{'Content-Type':'multipart/form-data'} }); loadAll(); toast.success('Fotos subidas!'); }
    catch { toast.error('Error al subir'); }
    finally { setUploading(false); }
  };

  // ── SERVICES ──
  const startNewService = () => { setEditingService('new'); setServiceForm({ icon:'⚡', title:'', titleEn:'', description:'', descriptionEn:'', features:[], featuresEn:[], priceLabel:'', priceLabelEn:'', priceFrom:0, priceTo:0, featured:false, newFeature:'', newFeatureEn:'' }); };
  const startEditService = (s) => { setEditingService(s.id); setServiceForm({ ...s, features:[...(s.features||[])], featuresEn:[...(s.featuresEn||[])], newFeature:'', newFeatureEn:'' }); };
  const saveService = async () => {
    try {
      const { newFeature, newFeatureEn, ...payload } = serviceForm;
      if (editingService === 'new') { await api.post('/services', payload); toast.success('Servicio creado!'); }
      else { await api.put(`/services/${editingService}`, payload); toast.success('Servicio actualizado!'); }
      setEditingService(null); loadAll();
    } catch { toast.error('Error al guardar'); }
  };

  // ── TESTIMONIALS ──
  const startNewTestimonial = () => { setEditingTestimonial('new'); setTestimonialForm({ name:'', company:'', role:'', rating:5, text:'', textEn:'', featured:false }); };
  const saveTestimonial = async () => {
    try {
      if (editingTestimonial === 'new') { await api.post('/testimonials', testimonialForm); toast.success('Testimonio creado!'); }
      else { await api.put(`/testimonials/${editingTestimonial}`, testimonialForm); toast.success('Actualizado!'); }
      setEditingTestimonial(null); loadAll();
    } catch { toast.error('Error'); }
  };

  // ── SETTINGS ──
  const startEditSettings = () => { setSettingsForm({...settings}); setEditingSettings(true); };
  const saveSettings = async () => {
    try { await api.put('/settings', settingsForm); toast.success('Configuración guardada!'); setEditingSettings(false); loadAll(); }
    catch { toast.error('Error'); }
  };
  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append('avatar', file);
    try { await api.post('/settings/avatar', fd, { headers:{'Content-Type':'multipart/form-data'} }); loadAll(); toast.success('Avatar actualizado!'); }
    catch { toast.error('Error'); }
  };

  // ── MESSAGES ──
  const markRead = async (id) => { await api.put(`/messages/${id}/read`); loadAll(); };
  const deleteMessage = async (id) => { if (!window.confirm('¿Eliminar mensaje?')) return; await api.delete(`/messages/${id}`); loadAll(); };

  const TABS = [
    { id:'dashboard', icon:'📊', label:'Dashboard' },
    { id:'projects', icon:'💻', label:'Proyectos' },
    { id:'services', icon:'⚡', label:'Servicios' },
    { id:'testimonials', icon:'⭐', label:'Testimonios' },
    { id:'messages', icon:'📬', label:`Mensajes${unread > 0 ? ` (${unread})` : ''}` },
    { id:'settings', icon:'⚙️', label:'Configuración' },
  ];

  const inp = (label, val, onChange, type='text', placeholder='') => (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} value={val||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
  const ta = (label, val, onChange, rows=3) => (
    <div className="form-group">
      <label>{label}</label>
      <textarea value={val||''} onChange={e=>onChange(e.target.value)} rows={rows} />
    </div>
  );

  return (
    <div className="adm">
      <aside className="adm__sidebar">
        <div className="adm__logo"><span>&lt;</span>dano<span className="g">gomez</span><span>/&gt;</span></div>
        <nav className="adm__nav">
          {TABS.map(t => (
            <button key={t.id} className={`adm__nav-item${tab===t.id?' active':''}`} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <div className="adm__footer">
          <span>👤 {user?.username}</span>
          <button onClick={() => { logout(); navigate('/admin/login'); }} className="adm__logout">Salir</button>
        </div>
      </aside>

      <main className="adm__main">
        <header className="adm__header">
          <h1>{TABS.find(t=>t.id===tab)?.icon} {TABS.find(t=>t.id===tab)?.label}</h1>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold" style={{fontSize:13}}>Ver portfolio →</a>
        </header>

        <div className="adm__content">

          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <div>
              <div className="adm__stats">
                {[
                  { label:'Proyectos', value: projects.length, icon:'💻' },
                  { label:'Servicios', value: services.length, icon:'⚡' },
                  { label:'Testimonios', value: testimonials.length, icon:'⭐' },
                  { label:'Mensajes sin leer', value: unread, icon:'📬', alert: unread > 0 },
                ].map((s,i) => (
                  <div key={i} className={`adm__stat-card${s.alert?' alert':''}`}>
                    <span className="adm__stat-icon">{s.icon}</span>
                    <div>
                      <div className="adm__stat-value">{s.value}</div>
                      <div className="adm__stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="adm__card" style={{marginTop:24}}>
                <h2>Mensajes recientes</h2>
                {messages.slice(0,5).map(m => (
                  <div key={m.id} className={`msg-row${!m.read?' unread':''}`} onClick={() => markRead(m.id)}>
                    <div className="msg-row__dot" />
                    <div className="msg-row__info">
                      <strong>{m.name}</strong>
                      <span>{m.email}</span>
                      {m.service && <span className="badge badge-gold" style={{marginLeft:8}}>{m.service}</span>}
                    </div>
                    <span className="msg-row__date">{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
                {messages.length === 0 && <p className="adm__empty">No hay mensajes aún.</p>}
              </div>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {tab === 'projects' && (
            <div>
              <div className="adm__top-bar">
                <span>{projects.length} proyectos</span>
                <button className="btn btn-gold" onClick={startNewProject}>+ Nuevo proyecto</button>
              </div>
              {editingProject && (
                <div className="adm__card adm__edit-card">
                  <h2>{editingProject==='new'?'Nuevo proyecto':'Editar proyecto'}</h2>
                  <div className="adm__grid-2">
                    {inp('Título (ES)', projectForm.title, v=>setProjectForm(f=>({...f,title:v})), 'text', 'KTL Kart')}
                    {inp('Título (EN)', projectForm.titleEn, v=>setProjectForm(f=>({...f,titleEn:v})), 'text', 'KTL Kart')}
                  </div>
                  <div className="adm__grid-2">
                    {inp('Slug (URL)', projectForm.slug, v=>setProjectForm(f=>({...f,slug:v.toLowerCase().replace(/\s+/g,'-')})), 'text', 'ktlkart')}
                    {inp('Categoría', projectForm.category, v=>setProjectForm(f=>({...f,category:v})), 'text', 'Web App')}
                  </div>
                  {ta('Descripción (ES)', projectForm.description, v=>setProjectForm(f=>({...f,description:v})))}
                  {ta('Descripción (EN)', projectForm.descriptionEn, v=>setProjectForm(f=>({...f,descriptionEn:v})))}
                  <div className="adm__grid-2">
                    {inp('URL en vivo', projectForm.liveUrl, v=>setProjectForm(f=>({...f,liveUrl:v})), 'url', 'https://')}
                    {inp('Repo GitHub', projectForm.repoUrl, v=>setProjectForm(f=>({...f,repoUrl:v})), 'url', 'https://github.com/')}
                  </div>
                  {/* Tech */}
                  <div className="form-group">
                    <label>Tecnologías</label>
                    <div className="adm__tags">
                      {projectForm.tech?.map((t,i) => <div key={i} className="adm__tag">{t}<button onClick={()=>setProjectForm(f=>({...f,tech:f.tech.filter((_,idx)=>idx!==i)}))}>✕</button></div>)}
                    </div>
                    <div className="adm__add-row">
                      <input value={projectForm.newTech||''} onChange={e=>setProjectForm(f=>({...f,newTech:e.target.value}))} placeholder="React, Node.js..." onKeyDown={e=>{if(e.key==='Enter'&&projectForm.newTech?.trim()){setProjectForm(f=>({...f,tech:[...f.tech,f.newTech.trim()],newTech:''}));}}} />
                      <button className="btn btn-gold" onClick={()=>{if(projectForm.newTech?.trim())setProjectForm(f=>({...f,tech:[...f.tech,f.newTech.trim()],newTech:''}));}}>+ Add</button>
                    </div>
                  </div>
                  <div className="adm__grid-2">
                    <div className="form-group">
                      <label>Status</label>
                      <select value={projectForm.status||'published'} onChange={e=>setProjectForm(f=>({...f,status:e.target.value}))}>
                        <option value="published">Publicado</option>
                        <option value="draft">Borrador</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Destacado</label>
                      <select value={projectForm.featured?.toString()||'false'} onChange={e=>setProjectForm(f=>({...f,featured:e.target.value==='true'}))}>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="adm__form-footer">
                    <button className="btn btn-dark" onClick={() => setEditingProject(null)}>Cancelar</button>
                    <button className="btn btn-gold" onClick={saveProject}>💾 Guardar</button>
                  </div>
                </div>
              )}
              {projects.map(p => (
                <div key={p.id} className="adm__card adm__project-row">
                  <div className="adm__project-info">
                    {p.images?.[0] && <img src={`${API}${p.images[0]}`} alt={p.title} className="adm__project-thumb"/>}
                    <div>
                      <h3>{p.title}</h3>
                      <span className="adm__project-meta">{p.category} · {p.status} · {p.tech?.slice(0,3).join(', ')}</span>
                      <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>
                        {p.images?.map((img,i) => <img key={i} src={`${API}${img}`} alt="" className="adm__project-img-sm"/>)}
                      </div>
                    </div>
                  </div>
                  <div className="adm__project-actions">
                    <label className="btn btn-dark" style={{fontSize:12,cursor:'pointer'}}>
                      {uploading ? '...' : '📷 Fotos'}
                      <input type="file" multiple accept="image/*" style={{display:'none'}} onChange={e=>uploadProjectImages(e,p.id)} />
                    </label>
                    <button className="btn btn-outline-gold" style={{fontSize:12}} onClick={()=>startEditProject(p)}>✏️ Editar</button>
                    <button className="btn btn-dark" style={{fontSize:12,color:'#f87171'}} onClick={()=>deleteProject(p.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── SERVICES ── */}
          {tab === 'services' && (
            <div>
              <div className="adm__top-bar">
                <span>{services.length} servicios</span>
                <button className="btn btn-gold" onClick={startNewService}>+ Nuevo servicio</button>
              </div>
              {editingService && (
                <div className="adm__card adm__edit-card">
                  <h2>{editingService==='new'?'Nuevo servicio':'Editar servicio'}</h2>
                  <div className="adm__grid-2">
                    {inp('Ícono (emoji)', serviceForm.icon, v=>setServiceForm(f=>({...f,icon:v})), 'text', '⚡')}
                    {inp('Título (ES)', serviceForm.title, v=>setServiceForm(f=>({...f,title:v})))}
                  </div>
                  <div className="adm__grid-2">
                    {inp('Título (EN)', serviceForm.titleEn, v=>setServiceForm(f=>({...f,titleEn:v})))}
                    {inp('Precio desde (USD)', serviceForm.priceFrom, v=>setServiceForm(f=>({...f,priceFrom:Number(v)})), 'number')}
                  </div>
                  <div className="adm__grid-2">
                    {inp('Etiqueta precio (ES)', serviceForm.priceLabel, v=>setServiceForm(f=>({...f,priceLabel:v})), 'text', 'desde $150 USD')}
                    {inp('Etiqueta precio (EN)', serviceForm.priceLabelEn, v=>setServiceForm(f=>({...f,priceLabelEn:v})), 'text', 'from $150 USD')}
                  </div>
                  {ta('Descripción (ES)', serviceForm.description, v=>setServiceForm(f=>({...f,description:v})))}
                  {ta('Descripción (EN)', serviceForm.descriptionEn, v=>setServiceForm(f=>({...f,descriptionEn:v})))}
                  {/* Features ES */}
                  <div className="form-group">
                    <label>Características (ES)</label>
                    <div className="adm__tags">
                      {serviceForm.features?.map((f,i)=><div key={i} className="adm__tag">{f}<button onClick={()=>setServiceForm(sf=>({...sf,features:sf.features.filter((_,idx)=>idx!==i)}))}>✕</button></div>)}
                    </div>
                    <div className="adm__add-row">
                      <input value={serviceForm.newFeature||''} onChange={e=>setServiceForm(f=>({...f,newFeature:e.target.value}))} placeholder="Nueva característica..." onKeyDown={e=>{if(e.key==='Enter'&&serviceForm.newFeature?.trim()){setServiceForm(f=>({...f,features:[...f.features,f.newFeature.trim()],newFeature:''}));}}} />
                      <button className="btn btn-gold" onClick={()=>{if(serviceForm.newFeature?.trim())setServiceForm(f=>({...f,features:[...f.features,f.newFeature.trim()],newFeature:''}));}}>+</button>
                    </div>
                  </div>
                  <div className="adm__form-footer">
                    <button className="btn btn-dark" onClick={()=>setEditingService(null)}>Cancelar</button>
                    <button className="btn btn-gold" onClick={saveService}>💾 Guardar</button>
                  </div>
                </div>
              )}
              {services.map(s => (
                <div key={s.id} className="adm__card" style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:16}}>
                    <span style={{fontSize:32}}>{s.icon}</span>
                    <div>
                      <strong>{s.title}</strong>
                      <p style={{fontSize:13,color:'var(--gray-600)',marginTop:2}}>{s.priceLabel}</p>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button className="btn btn-outline-gold" style={{fontSize:12}} onClick={()=>startEditService(s)}>✏️ Editar</button>
                    <button className="btn btn-dark" style={{fontSize:12,color:'#f87171'}} onClick={async()=>{if(window.confirm('¿Eliminar?')){await api.delete(`/services/${s.id}`);loadAll();}}}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── TESTIMONIALS ── */}
          {tab === 'testimonials' && (
            <div>
              <div className="adm__top-bar">
                <span>{testimonials.length} testimonios</span>
                <button className="btn btn-gold" onClick={startNewTestimonial}>+ Nuevo</button>
              </div>
              {editingTestimonial && (
                <div className="adm__card adm__edit-card">
                  <h2>{editingTestimonial==='new'?'Nuevo testimonio':'Editar'}</h2>
                  <div className="adm__grid-2">
                    {inp('Nombre', testimonialForm.name, v=>setTestimonialForm(f=>({...f,name:v})))}
                    {inp('Empresa', testimonialForm.company, v=>setTestimonialForm(f=>({...f,company:v})))}
                  </div>
                  <div className="adm__grid-2">
                    {inp('Cargo / Rol', testimonialForm.role, v=>setTestimonialForm(f=>({...f,role:v})))}
                    <div className="form-group">
                      <label>Rating</label>
                      <select value={testimonialForm.rating||5} onChange={e=>setTestimonialForm(f=>({...f,rating:Number(e.target.value)}))}>
                        {[5,4,3,2,1].map(n=><option key={n} value={n}>{n} ⭐</option>)}
                      </select>
                    </div>
                  </div>
                  {ta('Testimonio (ES)', testimonialForm.text, v=>setTestimonialForm(f=>({...f,text:v})))}
                  {ta('Testimonio (EN)', testimonialForm.textEn, v=>setTestimonialForm(f=>({...f,textEn:v})))}
                  <div className="adm__form-footer">
                    <button className="btn btn-dark" onClick={()=>setEditingTestimonial(null)}>Cancelar</button>
                    <button className="btn btn-gold" onClick={saveTestimonial}>💾 Guardar</button>
                  </div>
                </div>
              )}
              {testimonials.map(tm => (
                <div key={tm.id} className="adm__card" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16,flexWrap:'wrap'}}>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                      <div className="testimonial-card__avatar">{tm.name?.[0]}</div>
                      <div>
                        <strong>{tm.name}</strong>
                        <p style={{fontSize:12,color:'var(--gray-600)'}}>{tm.role} · {tm.company}</p>
                      </div>
                    </div>
                    <p style={{fontSize:13,color:'var(--gray-400)',fontStyle:'italic',maxWidth:500}}>"{tm.text?.slice(0,120)}..."</p>
                  </div>
                  <div style={{display:'flex',gap:8,flexShrink:0}}>
                    <button className="btn btn-outline-gold" style={{fontSize:12}} onClick={()=>{setEditingTestimonial(tm.id);setTestimonialForm({...tm});}}>✏️</button>
                    <button className="btn btn-dark" style={{fontSize:12,color:'#f87171'}} onClick={async()=>{if(window.confirm('¿Eliminar?')){await api.delete(`/testimonials/${tm.id}`);loadAll();}}}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── MESSAGES ── */}
          {tab === 'messages' && (
            <div className="adm__card">
              <h2>Mensajes ({messages.length})</h2>
              {messages.length === 0 && <p className="adm__empty">No hay mensajes aún.</p>}
              {messages.map(m => (
                <div key={m.id} className={`msg-full${!m.read?' unread':''}`} onClick={() => markRead(m.id)}>
                  <div className="msg-full__header">
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      {!m.read && <span className="unread-dot"/>}
                      <strong>{m.name}</strong>
                      <span style={{fontSize:12,color:'var(--gray-600)'}}>{m.email}</span>
                      {m.service && <span className="badge badge-gold">{m.service}</span>}
                      {m.budget && <span className="badge" style={{background:'rgba(255,255,255,0.05)',color:'var(--gray-400)'}}>{m.budget}</span>}
                    </div>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <span style={{fontSize:12,color:'var(--gray-600)'}}>{new Date(m.createdAt).toLocaleString()}</span>
                      {m.phone && <a href={`https://wa.me/${m.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="btn btn-dark" style={{fontSize:11,padding:'4px 10px'}}>WhatsApp</a>}
                      <a href={`mailto:${m.email}`} className="btn btn-outline-gold" style={{fontSize:11,padding:'4px 10px'}}>Reply</a>
                      <button className="btn btn-dark" style={{fontSize:11,padding:'4px 8px',color:'#f87171'}} onClick={e=>{e.stopPropagation();deleteMessage(m.id);}}>🗑️</button>
                    </div>
                  </div>
                  <p className="msg-full__body">{m.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && settings && (
            <div className="adm__card">
              <div className="adm__top-bar" style={{marginBottom:24}}>
                <h2>Configuración del portfolio</h2>
                {!editingSettings
                  ? <button className="btn btn-gold" onClick={startEditSettings}>✏️ Editar</button>
                  : <div style={{display:'flex',gap:8}}><button className="btn btn-dark" onClick={()=>setEditingSettings(false)}>Cancelar</button><button className="btn btn-gold" onClick={saveSettings}>💾 Guardar</button></div>
                }
              </div>

              {/* Avatar */}
              <div className="adm__avatar-section">
                <div className="adm__avatar">
                  {settings.avatar
                    ? <img src={`${API}${settings.avatar}`} alt="avatar"/>
                    : <span>{settings.name?.[0]}</span>
                  }
                </div>
                <div>
                  <strong>{settings.name}</strong>
                  <p style={{fontSize:13,color:'var(--gray-600)'}}>{settings.role}</p>
                  <input type="file" accept="image/*" ref={avatarRef} style={{display:'none'}} onChange={uploadAvatar} />
                  <button className="btn btn-dark" style={{fontSize:12,marginTop:10}} onClick={()=>avatarRef.current?.click()}>📷 Cambiar foto</button>
                </div>
              </div>

              {editingSettings ? (
                <div style={{display:'flex',flexDirection:'column',gap:16,marginTop:24}}>
                  <div className="adm__grid-2">
                    {inp('Nombre', settingsForm.name, v=>setSettingsForm(f=>({...f,name:v})))}
                    {inp('Alias/Handle', settingsForm.alias, v=>setSettingsForm(f=>({...f,alias:v})))}
                  </div>
                  <div className="adm__grid-2">
                    {inp('Rol (ES)', settingsForm.role, v=>setSettingsForm(f=>({...f,role:v})))}
                    {inp('Rol (EN)', settingsForm.roleEn, v=>setSettingsForm(f=>({...f,roleEn:v})))}
                  </div>
                  {inp('Tagline (ES)', settingsForm.tagline, v=>setSettingsForm(f=>({...f,tagline:v})))}
                  {inp('Tagline (EN)', settingsForm.taglineEn, v=>setSettingsForm(f=>({...f,taglineEn:v})))}
                  {ta('Bio (ES)', settingsForm.bio, v=>setSettingsForm(f=>({...f,bio:v})))}
                  {ta('Bio (EN)', settingsForm.bioEn, v=>setSettingsForm(f=>({...f,bioEn:v})))}
                  <div className="adm__grid-2">
                    {inp('Email', settingsForm.email, v=>setSettingsForm(f=>({...f,email:v})), 'email')}
                    {inp('WhatsApp', settingsForm.whatsapp, v=>setSettingsForm(f=>({...f,whatsapp:v})))}
                  </div>
                  <div className="adm__grid-2">
                    {inp('GitHub URL', settingsForm.github, v=>setSettingsForm(f=>({...f,github:v})), 'url')}
                    {inp('LinkedIn URL', settingsForm.linkedin, v=>setSettingsForm(f=>({...f,linkedin:v})), 'url')}
                  </div>
                  <div className="adm__grid-2">
                    {inp('Proyectos (ej: 5+)', settingsForm.projectsDone, v=>setSettingsForm(f=>({...f,projectsDone:v})))}
                    {inp('Clientes (ej: 3+)', settingsForm.happyClients, v=>setSettingsForm(f=>({...f,happyClients:v})))}
                  </div>
                  <div className="adm__grid-2">
                    {inp('Años experiencia (ej: 2+)', settingsForm.yearsExp, v=>setSettingsForm(f=>({...f,yearsExp:v})))}
                    <div className="form-group">
                      <label>Disponible para proyectos</label>
                      <select value={settingsForm.availability?.toString()||'true'} onChange={e=>setSettingsForm(f=>({...f,availability:e.target.value==='true'}))}>
                        <option value="true">Sí, disponible</option>
                        <option value="false">No disponible</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="adm__settings-view">
                  {[
                    ['Tagline ES', settings.tagline], ['Tagline EN', settings.taglineEn],
                    ['Email', settings.email], ['WhatsApp', settings.whatsapp],
                    ['GitHub', settings.github], ['Proyectos', settings.projectsDone],
                    ['Clientes', settings.happyClients], ['Experiencia', settings.yearsExp],
                    ['Disponible', settings.availability ? '✅ Sí' : '❌ No'],
                  ].map(([k,v]) => v && (
                    <div key={k} className="settings-row">
                      <span className="settings-row__key">{k}</span>
                      <span className="settings-row__val">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
