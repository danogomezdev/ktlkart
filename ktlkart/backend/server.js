require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({ 
  origin: ['http://localhost:3000', 'https://ktlkart.vercel.app', 'https://ktlkart.com.ar'], 
  credentials: true 
}));
// app.use(cors({ origin: ['http://localhost:3001', 'https://ktlkart.com.ar'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/products', require('./routes/products'));
app.use('/api/gallery', require('./routes/gallery'));

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`KTL Kart server on port ${PORT}`));
