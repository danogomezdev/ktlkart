const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send', async (req, res) => {
  const { name, email, phone, product, message, type } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nombre, email y mensaje son requeridos' });
  }
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  const subject = type === 'reserva' ? `Nueva Reserva - ${product} | KTL Kart` : `Nueva Consulta - ${product || 'General'} | KTL Kart`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#003087;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
      <h1 style="color:white;margin:0;">KTL KART</h1>
      <p style="color:#87CEEB;margin:5px 0 0;">${type === 'reserva' ? 'Nueva Reserva' : 'Nueva Consulta'}</p>
    </div>
    <div style="background:white;padding:25px;border-radius:0 0 8px 8px;border:1px solid #eee;">
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone || 'No indicado'}</p>
      <p><strong>Producto:</strong> ${product || 'No especificado'}</p>
      <p><strong>Mensaje:</strong></p>
      <p style="background:#f5f5f5;padding:15px;border-radius:4px;">${message}</p>
    </div>
  </div>`;
  try {
    await transporter.sendMail({
      from: `"KTL Kart Web" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject,
      html
    });
    res.json({ success: true, message: 'Consulta enviada correctamente' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Error al enviar el email' });
  }
});

module.exports = router;
