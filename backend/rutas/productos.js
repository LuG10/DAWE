const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');

const db = mongojs('mongodb://localhost:27017/flora');

router.get('/', (req, res) => {
  db.productos.find({}, (err, productos) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener productos' });
    }

    const productosNormalizados = (productos || []).map((p) => ({
      ...p,
      id: p.id || String(p._id)
    }));

    res.json(productosNormalizados);
  });
});


router.post('/anadir', async (req, res) => { 
  const { id, nombre, precio, descripcion, imagen, categoria } = req.body;
  const precioNum = Number(precio);

  if (!id || !String(nombre || '').trim() || !String(descripcion || '').trim() || !imagen || !categoria) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  if (Number.isNaN(precioNum) || precioNum < 0) {
    return res.status(400).json({ error: 'Precio invalido' });
  }

  try {
    db.productos.findOne({ id }, (findErr, existente) => {
      if (findErr) {
        return res.status(500).json({ error: 'Error al validar producto' });
      }

      if (existente) {
        return res.status(409).json({ error: 'Ya existe un producto con ese id' });
      }

      db.productos.insert({ id, nombre, precio: precioNum, descripcion, imagen, categoria }, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al registrar producto' });
        }
        res.json({ message: 'Producto registrado' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
});


router.delete('/eliminar/:id', (req, res) => {
  const { id } = req.params;
  db.productos.remove({ id }, { justOne: true }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar producto' });
    }

    const eliminados = typeof result === 'number' ? result : (result?.deletedCount ?? result?.n ?? 0);
    if (!eliminados) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado' });
  });
});


router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, precio, descripcion, imagen, categoria } = req.body;
  const updateDoc = {};

  if (nombre !== undefined) updateDoc.nombre = nombre;
  if (precio !== undefined) updateDoc.precio = precio;
  if (descripcion !== undefined) updateDoc.descripcion = descripcion;
  if (imagen !== undefined) updateDoc.imagen = imagen;
  if (categoria !== undefined) updateDoc.categoria = categoria;

  if (Object.keys(updateDoc).length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  db.productos.update({ id }, { $set: updateDoc }, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar producto' });
      }
      res.json({ message: 'Producto actualizado' });
    });
});

module.exports = router;