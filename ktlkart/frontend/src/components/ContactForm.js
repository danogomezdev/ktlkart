import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './ContactForm.css';

export default function ContactForm({ preselectedProduct }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    product: preselectedProduct || '',
    message: '', type: 'consulta'
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contact/send', form);
      toast.success('¡Consulta enviada! Te contactaremos pronto.');
      setForm({ name: '', email: '', phone: '', product: preselectedProduct || '', message: '', type: 'consulta' });
    } catch {
      toast.error('Error al enviar. Intentá por WhatsApp.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__type">
        {['consulta', 'reserva'].map(t => (
          <button
            type="button" key={t}
            className={`type-btn${form.type === t ? ' active' : ''}`}
            onClick={() => setForm(f => ({ ...f, type: t }))}
          >
            {t === 'consulta' ? '📩 Consulta' : '🏎️ Reserva'}
          </button>
        ))}
      </div>

      <div className="contact-form__row">
        <div className="form-group">
          <label>Nombre *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Tu nombre completo" required />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" required />
        </div>
      </div>

      <div className="contact-form__row">
        <div className="form-group">
          <label>Teléfono</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="+54 9 XXX XXXXXXX" />
        </div>
        <div className="form-group">
          <label>Producto de interés</label>
          <select name="product" value={form.product} onChange={handleChange}>
            <option value="">Seleccionar...</option>
            <option value="KTL Tierra">KTL Tierra</option>
            <option value="KTL Asfalto">KTL Asfalto</option>
            <option value="KTL Escuela">KTL Escuela</option>
            <option value="General">Consulta general</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Mensaje *</label>
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Contanos tu consulta o qué necesitás..." rows={5} required />
      </div>

      <button type="submit" className="btn btn-primary contact-form__submit" disabled={sending}>
        {sending ? 'Enviando...' : form.type === 'reserva' ? '🏎️ Enviar Reserva' : '📩 Enviar Consulta'}
      </button>
    </form>
  );
}
