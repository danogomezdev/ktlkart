const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Default admin credentials (in production use a real DB)
const ADMIN = {
  username: process.env.ADMIN_USER || 'admin',
  // Password: ktlkart2024 (hashed)
  passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'ktlkart2024', 10)
};

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN.username || !bcrypt.compareSync(password, ADMIN.passwordHash)) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }
  const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, username });
});

router.get('/verify', require('../middleware/auth'), (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
