import React, { useState } from 'react';
import { sendContact } from '../utils/api';
import { toast } from 'react-toastify';
import './Contact.css';

const WA = 'https://wa.me/5493462597788';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) { toast.error('Nombre y mensaje son obligatorios'); return; }
    setLoading(true);
    try {
      await sendContact(form);
      toast.success('¡Consulta enviada! Te contactamos pronto.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch { toast.error('Error al enviar. Escribinos por WhatsApp.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero__inner container">
          <h1>Contacto</h1>
          <p>Consultanos sobre nuestros chasis</p>
        </div>
      </div>

      <div className="section contact-section container">
        <div className="contact-body">
          <div className="contact-info">
            <div className="contact-card">
              <span className="contact-card__icon">📍</span>
              <div><span className="contact-card__label">Ubicación</span><span className="contact-card__value">Argentina</span></div>
            </div>
            <div className="contact-card">
              <span className="contact-card__icon">📱</span>
              <div><span className="contact-card__label">WhatsApp</span><a href={WA} target="_blank" rel="noopener noreferrer" className="contact-card__value link">+54 9 3462 59-7788</a></div>
            </div>
            <div className="contact-card">
              <span className="contact-card__icon">✉️</span>
              <div><span className="contact-card__label">Email</span><span className="contact-card__value">Gonzalovega23@icloud.com</span></div>
            </div>
            <div className="contact-wa">
              <span className="contact-wa__icon">💬</span>
              <div>
                <h3>WhatsApp directo</h3>
                <p>Respondemos consultas al instante por WhatsApp.</p>
                <a href={`${WA}?text=Hola! Quiero consultar sobre los chasis KTL.`} target="_blank" rel="noopener noreferrer" className="btn btn-wa">Abrir WhatsApp</a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Envianos tu consulta</h2>
            <div className="contact-form__grid">
              <div className="form-group"><label>Nombre *</label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tu nombre" /></div>
              <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="tu@email.com" /></div>
              <div className="form-group"><label>Teléfono</label><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+54 9 ..." /></div>
              <div className="form-group"><label>Asunto</label><input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Chasis Tierra, Asfalto..." /></div>
            </div>
            <div className="form-group"><label>Mensaje *</label><textarea value={form.message} onChange={e => set('message', e.target.value)} placeholder="Contanos qué necesitás..." rows={5} /></div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Enviando...' : 'Enviar consulta →'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
