const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const DATA_FILE = path.join(__dirname, '../data/products.json');

const defaultProducts = [
  {
    id: 1, name: "KTL Tierra", category: "tierra", tagline: "Dominá cada curva en la tierra",
    description: "El chasis KTL Tierra fue diseñado para pistas de tierra, ofreciendo máxima estabilidad y control en superficies irregulares. Su construcción robusta y geometría optimizada lo hacen ideal para pilotos que buscan rendimiento en condiciones desafiantes.",
    features: ["Tubería de acero de alta resistencia","Geometría optimizada para tierra","Mayor distancia al suelo","Sistema de amortiguación reforzado","Soldaduras TIG de precisión","Disponible en múltiples tallas"],
    specs: {"Material":"Acero CrMo 4130","Peso":"8.5 kg","Ancho":"1.040 mm","Largo":"1.820 mm","Categorías":"Rotax, KA100, X30"},
    price: null, images: [], available: true
  },
  {
    id: 2, name: "KTL Asfalto", category: "asfalto", tagline: "Velocidad y precisión en cada metro",
    description: "El chasis KTL Asfalto está construido para exprimir cada décima en pistas de asfalto. Su diseño aerodinámico y rigidez controlada ofrecen respuesta inmediata y predecible, perfecta para competición.",
    features: ["Diseño aerodinámico optimizado","Rigidez controlada de alta precisión","Bajo centro de gravedad","Compatibilidad con accesorios de competición","Soldaduras TIG de precisión","Fácil ajuste de geometría"],
    specs: {"Material":"Acero CrMo 4130","Peso":"7.8 kg","Ancho":"1.020 mm","Largo":"1.800 mm","Categorías":"Rotax, X30, KZ"},
    price: null, images: [], available: true
  },
  {
    id: 3, name: "KTL Escuela", category: "escuela", tagline: "El primer paso hacia la victoria",
    description: "El chasis KTL Escuela es la puerta de entrada al karting. Diseñado para pilotos que dan sus primeros pasos, ofrece una plataforma segura, estable y divertida para aprender las bases del karting.",
    features: ["Diseño seguro y estable","Ideal para principiantes","Bajo mantenimiento","Construcción duradera","Compatible con motores de escuela","Fácil de configurar"],
    specs: {"Material":"Acero 1020","Peso":"9.2 kg","Ancho":"1.030 mm","Largo":"1.810 mm","Categorías":"Escuela, Cadet, Mini"},
    price: null, images: [], available: true
  }
];

function getProducts() {
  if (!fs.existsSync(DATA_FILE)) { fs.writeFileSync(DATA_FILE, JSON.stringify(defaultProducts, null, 2)); return defaultProducts; }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function saveProducts(p) { fs.writeFileSync(DATA_FILE, JSON.stringify(p, null, 2)); }

router.get('/', (req, res) => res.json(getProducts()));
router.get('/:id', (req, res) => {
  const p = getProducts().find(p => p.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ error: 'No encontrado' });
  res.json(p);
});
router.put('/:id', authMiddleware, (req, res) => {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  products[idx] = { ...products[idx], ...req.body, id: products[idx].id };
  saveProducts(products);
  res.json(products[idx]);
});

module.exports = router;
