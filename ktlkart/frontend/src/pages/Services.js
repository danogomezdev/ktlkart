import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import api from '../utils/api';
import './Services.css';

export default function Services() {
  const { t, lang } = useLang();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/services').then(r => { setServices(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const PROCESS = [
    { num: '01', title: t('Consulta gratis', 'Free consultation'), desc: t('Hablamos de tu proyecto, objetivos y presupuesto. Sin compromiso.', 'We talk about your project, goals, and budget. No commitment.') },
    { num: '02', title: t('Propuesta', 'Proposal'), desc: t('Te envío una propuesta detallada con alcance, tiempo y precio.', 'I send you a detailed proposal with scope, timeline, and price.') },
    { num: '03', title: t('Desarrollo', 'Development'), desc: t('Comienzo el desarrollo con actualizaciones regulares para vos.', 'I start development with regular updates for you.') },
    { num: '04', title: t('Entrega', 'Delivery'), desc: t('Revisiones, ajustes finales y entrega del proyecto completo.', 'Revisions, final adjustments, and full project delivery.') },
  ];

  const FAQS = [
    { q: t('¿Cuánto demora un proyecto?', 'How long does a project take?'), a: t('Depende del alcance. Una landing page toma 5-7 días, un sitio corporativo 10-15 días, y una app compleja puede tomar 30+ días.', 'Depends on scope. A landing page takes 5-7 days, a corporate site 10-15 days, and a complex app can take 30+ days.') },
    { q: t('¿Cómo es el proceso de pago?', 'How does payment work?'), a: t('50% de anticipo al inicio y 50% al entregar el proyecto. Acepto transferencias, efectivo y criptomonedas (USDT).', '50% upfront and 50% on delivery. I accept bank transfers, cash, and crypto (USDT).') },
    { q: t('¿Ofrecés mantenimiento?', 'Do you offer maintenance?'), a: t('Sí! Tengo planes mensuales desde $50 USD que incluyen soporte, actualizaciones y cambios menores.', 'Yes! I have monthly plans from $50 USD including support, updates, and minor changes.') },
    { q: t('¿Trabajás con clientes del exterior?', 'Do you work with international clients?'), a: t('Absolutamente. Trabajo con clientes de toda América y Europa. Acepto pagos en USD y USDT.', 'Absolutely. I work with clients across the Americas and Europe. I accept payments in USD and USDT.') },
  ];

  return (
    <div className="services-page">
      {/* Header */}
      <section className="services-hero">
        <div className="services-hero__bg" />
        <div className="container services-hero__inner">
          <p className="section-label">{t('Lo que ofrezco', 'What I offer')}</p>
          <h1 className="section-title">
            {t('Servicios de', 'Web Development')}<br/>
            <span className="gold-gradient">{t('Desarrollo Web', 'Services')}</span>
          </h1>
          <p className="services-hero__sub">{t('Soluciones digitales a medida para hacer crecer tu negocio.', 'Custom digital solutions to grow your business.')}</p>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          {loading ? <div className="loading"><div className="spinner" /></div> : (
            <div className="services-full-grid">
              {services.map((s, i) => (
                <div key={s.id} className="service-full-card glass-card">
                  <div className="service-full-card__left">
                    <div className="service-full-card__icon">{s.icon}</div>
                    <div className="service-full-card__num">0{i + 1}</div>
                  </div>
                  <div className="service-full-card__body">
                    <div className="service-full-card__header">
                      <div>
                        <h2>{lang === 'es' ? s.title : (s.titleEn || s.title)}</h2>
                        <p>{lang === 'es' ? s.description : (s.descriptionEn || s.description)}</p>
                      </div>
                      <div className="service-full-card__price">
                        <span className="price-label">{lang === 'es' ? s.priceLabel : (s.priceLabelEn || s.priceLabel)}</span>
                      </div>
                    </div>
                    <ul className="service-full-card__features">
                      {(lang === 'es' ? s.features : (s.featuresEn || s.features))?.map((f, fi) => (
                        <li key={fi}><span className="check">✓</span>{f}</li>
                      ))}
                    </ul>
                    <Link to="/contacto" className="btn btn-gold" style={{alignSelf:'flex-start'}}>
                      {t('Consultar', 'Get a quote')} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="section process-section">
        <div className="process-section__bg" />
        <div className="container">
          <p className="section-label" style={{justifyContent:'center'}}>{t('Cómo trabajo', 'How I work')}</p>
          <h2 className="section-title" style={{textAlign:'center',marginBottom:'56px'}}>{t('Mi proceso', 'My process')}</h2>
          <div className="process-grid">
            {PROCESS.map((step, i) => (
              <div key={i} className="process-step glass-card">
                <div className="process-step__num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < PROCESS.length - 1 && <div className="process-step__arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section">
        <div className="container faq-inner">
          <div>
            <p className="section-label">FAQ</p>
            <h2 className="section-title">{t('Preguntas frecuentes', 'Common questions')}</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <details key={i} className="faq-item glass-card">
                <summary className="faq-item__q">
                  {faq.q}
                  <span className="faq-item__arrow">›</span>
                </summary>
                <p className="faq-item__a">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{textAlign:'center'}}>
        <div className="container">
          <h2 className="section-title">{t('¿Cuál es tu proyecto?', "What's your project?")}</h2>
          <p style={{color:'var(--gray-400)',marginTop:12,marginBottom:32,fontSize:16}}>{t('Contame tu idea y te doy un presupuesto en menos de 24hs.','Tell me your idea and I\'ll give you a quote in under 24 hours.')}</p>
          <Link to="/contacto" className="btn btn-gold" style={{padding:'16px 40px',fontSize:'15px'}}>
            {t('Contactar ahora', 'Contact now')} 🚀
          </Link>
        </div>
      </section>
    </div>
  );
}
