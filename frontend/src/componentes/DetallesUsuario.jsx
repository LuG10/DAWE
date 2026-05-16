import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DetallesUsuario({ setUser, user, estaOffline }) {
  const [formData, setFormData] = useState({ nombre: '', email: '', direccion: '', telefono: '', nacimiento: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        password: '',
        direccion: user.direccion || '',
        telefono: user.telefono || '',
        nacimiento: user.nacimiento || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:8000/api/usuarios/update',
        { nombre: formData.nombre, direccion: formData.direccion, telefono: formData.telefono, nacimiento: formData.nacimiento },
        { withCredentials: true }
      );

      const res = await axios.get('http://localhost:8000/api/usuarios/me', { withCredentials: true });
      setUser(res.data);
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      alert('Error al actualizar datos');
    }
  };

  if (!user) {
    return <div>Debes iniciar sesión para ver tus datos.</div>;
  }

  return (
    <div>
      <h3 className="mb-3">Mis Datos</h3>
      <form className="aside-login-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="campo-flotante">
              <input type="email" className="form-control" id="email" name="email" value={formData.email} disabled placeholder=" " required />
              <label htmlFor="email">Email</label>
          </div>
          <div className="campo-flotante">
              <input type="text" className="form-control" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder=" " disabled={estaOffline} required />
              <label htmlFor="nombre">Nombre</label>
          </div>
          <div className="campo-flotante">
              <input type="text" className="form-control" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} placeholder=" " disabled={estaOffline} required />
              <label htmlFor="direccion">Dirección</label>
          </div>
          <div className="campo-flotante">
              <input type="text" className="form-control" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} placeholder=" " disabled={estaOffline} required />
              <label htmlFor="telefono">Teléfono</label>
          </div>
          <div className="campo-flotante">
              <input type="text" className="form-control" id="nacimiento" name="nacimiento" value={formData.nacimiento} onChange={handleChange} placeholder=" " disabled={estaOffline} required />
              <label htmlFor="nacimiento">Fecha de Nacimiento</label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={estaOffline}>Guardar cambios</button>
      </form>
    </div>
  );
}

export default DetallesUsuario;
