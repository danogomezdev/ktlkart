import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Completá nombre, email y mensaje'); return; }
    setLoading(true);
    try {
      await api.post('/contact/send', form);
      toast.success('¡Mensaje enviado! Te respondemos a la brevedad 🏎️');
      setForm({ name:'', email:'', phone:'', subject:'', message:'' });
    } catch { toast.error('Error al enviar. Escribinos por WhatsApp.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero__inner">
          <h1>Contacto</h1>
          <p>Consultanos por precios, modelos y disponibilidad. Respondemos rápido.</p>
        </div>
      </section>
      <section className="section">
        <div className="container contact-body">
          <div className="contact-info">
            {[
              { icon:'📱', label:'WhatsApp', value:'+54 9 3462 597788', href:'https://wa.me/5493462597788' },
              { icon:'📧', label:'Email', value:'Gonzalovega23@icloud.com', href:'mailto:Gonzalovega23@icloud.com' },
              { icon:'📍', label:'Ubicación', value:'Argentina', href:null },
              { icon:'🕐', label:'Horario', value:'Lun - Sáb · 9:00 a 20:00', href:null },
            ].map((item, i) => (
              <div key={i} className="contact-card">
                <span className="contact-card__icon">{item.icon}</span>
                <div>
                  <span className="contact-card__label">{item.label}</span>
                  {item.href
                    ? <a href={item.href} target="_blank" rel="noopener noreferrer" className="contact-card__value link">{item.value}</a>
                    : <span className="contact-card__value">{item.value}</span>
                  }
                </div>
              </div>
            ))}
            <div className="contact-wa">
              <span className="contact-wa__icon">💬</span>
              <div>
                <h3>¿Preferís WhatsApp?</h3>
                <p>Mandanos un mensaje directo y te respondemos rápido.</p>
                <a href="https://wa.me/5493462597788?text=Hola! Quiero consultar sobre los chasis KTL." target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                  Abrir WhatsApp →
                </a>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Envianos un mensaje</h2>
            <div className="contact-form__grid">
              <div className="form-group"><label>Nombre *</label><input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Tu nombre"/></div>
              <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="tu@email.com"/></div>
              <div className="form-group"><label>Teléfono</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+54 9 ..."/></div>
              <div className="form-group">
                <label>Asunto</label>
                <select value={form.subject} onChange={e=>set('subject',e.target.value)}>
                  <option value="">Seleccioná...</option>
                  <option>Consulta Chasis Tierra</option>
                  <option>Consulta Chasis Asfalto</option>
                  <option>Consulta Escuela</option>
                  <option>Precio y disponibilidad</option>
                  <option>Otro</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label>Mensaje *</label><textarea value={form.message} onChange={e=>set('message',e.target.value)} placeholder="Contanos sobre tu consulta..." rows={5}/></div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading?'Enviando...':'Enviar consulta 🏎️'}</button>
          </form>
        </div>
      </section>
    </div>
  );
}
