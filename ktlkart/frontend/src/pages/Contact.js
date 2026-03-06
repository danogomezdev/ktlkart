import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './Contact.css';

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ name:'', email:'', phone:'', service:'', budget:'', message:'' });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error(t('Completá nombre, email y mensaje.', 'Fill in name, email and message.')); return; }
    setLoading(true);
    try {
      await api.post('/contact/send', form);
      toast.success(t('¡Mensaje enviado! Te respondo en menos de 24hs. 🚀', 'Message sent! I\'ll reply within 24 hours. 🚀'));
      setForm({ name:'', email:'', phone:'', service:'', budget:'', message:'' });
    } catch { toast.error(t('Error al enviar. Escribime por WhatsApp.', 'Error sending. Message me on WhatsApp.')); }
    finally { setLoading(false); }
  };

  const INFO = [
    { icon: '📧', label: 'Email', value: 'danogomezdev@gmail.com', href: 'mailto:danogomezdev@gmail.com' },
    { icon: '📱', label: 'WhatsApp', value: '+54 9 3462 688065', href: 'https://wa.me/5493462688065' },
    { icon: '📍', label: t('Ubicación','Location'), value: t('Cañada de Gómez, Argentina','Cañada de Gómez, Argentina'), href: null },
    { icon: '🕐', label: t('Disponibilidad','Availability'), value: t('Lun-Vie 9:00 - 21:00 (GMT-3)','Mon-Fri 9:00 - 21:00 (GMT-3)'), href: null },
  ];

  const SERVICES = [
    t('Landing Page','Landing Page'),
    t('Sitio Web Corporativo','Corporate Website'),
    'E-commerce',
    'Web App Full Stack',
    t('Mantenimiento','Maintenance'),
    t('Otro','Other'),
  ];

  const BUDGETS = ['$100 - $300 USD','$300 - $600 USD','$600 - $1,200 USD','$1,200 - $2,500 USD','$2,500+ USD'];

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero__bg" />
        <div className="container contact-hero__inner">
          <p className="section-label">{t('Hablemos','Let\'s talk')}</p>
          <h1 className="section-title">
            {t('Empecemos tu','Let\'s start your')}<br/>
            <span className="gold-gradient">{t('próximo proyecto','next project')}</span>
          </h1>
          <p className="contact-hero__sub">{t('Completá el formulario y te respondo en menos de 24 horas con una propuesta.','Fill in the form and I\'ll reply in under 24 hours with a proposal.')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-body">
          {/* Info */}
          <div className="contact-info">
            <div className="contact-info__cards">
              {INFO.map((item, i) => (
                <div key={i} className="contact-info__card glass-card">
                  <span className="contact-info__icon">{item.icon}</span>
                  <div>
                    <span className="contact-info__label">{item.label}</span>
                    {item.href
                      ? <a href={item.href} target="_blank" rel="noopener noreferrer" className="contact-info__value link">{item.value}</a>
                      : <span className="contact-info__value">{item.value}</span>
                    }
                  </div>
                </div>
              ))}
            </div>
            <div className="contact-info__wa glass-card">
              <div className="wa-card__icon">💬</div>
              <div>
                <h3>{t('¿Preferís WhatsApp?','Prefer WhatsApp?')}</h3>
                <p>{t('Mandame un mensaje directo y charlamos.','Send me a direct message and we\'ll chat.')}</p>
                <a href="https://wa.me/5493462688065?text=Hola! Vi tu portfolio y quiero hablar sobre un proyecto." target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{marginTop:16}}>
                  {t('Abrir WhatsApp','Open WhatsApp')} →
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="contact-form glass-card" onSubmit={handleSubmit}>
            <h2>{t('Contame sobre tu proyecto','Tell me about your project')}</h2>
            <div className="contact-form__grid">
              <div className="form-group">
                <label>{t('Tu nombre *','Your name *')}</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder={t('Nombre y apellido','Full name')} />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="tu@email.com" />
              </div>
              <div className="form-group">
                <label>{t('Teléfono / WhatsApp','Phone / WhatsApp')}</label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+54 9 ..." />
              </div>
              <div className="form-group">
                <label>{t('Servicio que necesitás','Service needed')}</label>
                <select value={form.service} onChange={e => set('service', e.target.value)}>
                  <option value="">{t('Seleccioná...','Select...')}</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>{t('Presupuesto estimado','Estimated budget')}</label>
              <div className="budget-options">
                {BUDGETS.map(b => (
                  <button type="button" key={b} className={`budget-btn${form.budget === b ? ' active' : ''}`} onClick={() => set('budget', b)}>{b}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>{t('Contame sobre tu proyecto *','Tell me about your project *')}</label>
              <textarea value={form.message} onChange={e => set('message', e.target.value)} placeholder={t('Describí qué necesitás, objetivos, referencias, etc.','Describe what you need, goals, references, etc.')} />
            </div>
            <button type="submit" className="btn btn-gold" disabled={loading} style={{width:'100%',justifyContent:'center',padding:'16px',fontSize:'15px'}}>
              {loading ? t('Enviando...','Sending...') : t('Enviar consulta 🚀','Send inquiry 🚀')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
