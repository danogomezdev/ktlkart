const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');

const DATA_FILE = path.join(__dirname, '../data/gallery.json');

function getGallery() {
  if (!fs.existsSync(DATA_FILE)) { fs.writeFileSync(DATA_FILE, '[]'); return []; }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function saveGallery(g) { fs.writeFileSync(DATA_FILE, JSON.stringify(g, null, 2)); }

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/gallery');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `gallery_${Date.now()}${ext}`);
  }
});

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/products');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `product_${req.params.productId}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Solo imágenes'));
    cb(null, true);
  }
});

const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Solo imágenes'));
    cb(null, true);
  }
});

// GET gallery
router.get('/', (req, res) => {
  const { product } = req.query;
  let gallery = getGallery();
  if (product) gallery = gallery.filter(i => i.product === product);
  res.json(gallery);
});

// POST upload to gallery (admin)
router.post('/upload', authMiddleware, upload.array('images', 20), (req, res) => {
  const gallery = getGallery();
  const { product, caption } = req.body;
  const newItems = req.files.map(file => ({
    id: Date.now() + Math.random(),
    filename: file.filename,
    url: `/uploads/gallery/${file.filename}`,
    product: product || 'general',
    caption: caption || '',
    uploadedAt: new Date().toISOString()
  }));
  gallery.push(...newItems);
  saveGallery(gallery);
  res.json({ success: true, items: newItems });
});

// POST upload product image (admin)
router.post('/product/:productId', authMiddleware, uploadProduct.array('images', 10), (req, res) => {
  const fs2 = require('fs');
  const productsFile = path.join(__dirname, '../data/products.json');
  const products = JSON.parse(fs2.readFileSync(productsFile, 'utf8'));
  const idx = products.findIndex(p => p.id === parseInt(req.params.productId));
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  const newImages = req.files.map(f => `/uploads/products/${f.filename}`);
  products[idx].images = [...(products[idx].images || []), ...newImages];
  fs2.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  res.json({ success: true, images: products[idx].images });
});

// DELETE gallery item (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  let gallery = getGallery();
  const item = gallery.find(i => String(i.id) === req.params.id);
  if (item) {
    const filePath = path.join(__dirname, '..', item.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    gallery = gallery.filter(i => String(i.id) !== req.params.id);
    saveGallery(gallery);
  }
  res.json({ success: true });
});

module.exports = router;
