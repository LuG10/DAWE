const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const bcrypt = require('bcrypt');

const db = mongojs('mongodb://localhost:27017/tienda');

router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === 'admin@example.com' ? 'admin' : 'user';
    db.usuarios.insert({ nombre, email, password: hashedPassword, role, visits: 0 }, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Error al registrar' });
      }
      res.json({ message: 'Usuario registrado' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
});


router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.usuarios.findOne({ email }, async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Incrementar visitas
    db.usuarios.update({ _id: user._id }, { $set: { visits: (user.visits || 0) + 1 } }, (err) => {
      if (err) console.log('Error updating visits');
    });
    req.session.userId = user._id;
    res.json({ message: 'Login exitoso' });
  });
});


router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout' });
});


router.get('/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  db.usuarios.findOne({ _id: mongojs.ObjectId(req.session.userId) }, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ nombre: user.nombre || 'Adrian', email: user.email, role: user.role || 'user', visits: user.visits || 0 });
  });
});


router.put('/update', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'Nombre obligatorio' });
  }
  try {
    const updateDoc = { nombre };
    db.usuarios.update(
      { _id: mongojs.ObjectId(req.session.userId) },
      { $set: updateDoc },
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar usuario' });
        }
        res.json({ message: 'Usuario actualizado' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

module.exports = router;