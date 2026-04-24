const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const bcrypt = require('bcrypt');

const db = mongojs('mongodb://localhost:27017/flora', ['usuarios']);

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
  // Limpiamos el email de espacios y lo pasamos a minúsculas
  const emailRecibido = req.body.email ? req.body.email.trim().toLowerCase() : "";
  
  console.log("--- INTENTO DE LOGIN ---");
  console.log("Email recibido del frontend:", `"${emailRecibido}"`);

  db.usuarios.findOne({ email: emailRecibido }, (err, usuario) => {
    if (err) {
      console.log("Error en la DB:", err);
      return res.status(500).json({ error: 'Error DB' });
    }
    
    if (!usuario) {
      console.log("RESULTADO: No existe en MongoDB");
      // Listamos los emails que SÍ existen en la DB para comparar
      db.usuarios.find({}, {email: 1}, (err, todos) => {
        console.log("Emails registrados en tu DB actualmente:", todos.map(u => `"${u.email}"`));
      });
      return res.status(401).json({ error: 'Usuario no existe en MongoDB' });
    }

    console.log("RESULTADO: Usuario encontrado, iniciando sesión para:", usuario.nombre);
    req.session.userId = usuario._id;
    req.session.user = usuario;
    res.status(200).json({ message: 'OK' });
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