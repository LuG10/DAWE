import { useState } from 'react';
import axios from 'axios';

function Editar_borrarProducto({productosBase, estaOffline, onProductoActualizado}) {
  const [seleccionados, setSeleccionados] = useState([]);
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);
  const [formData, setFormData] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  const seleccionar = (productoId) => {
    setSeleccionados((prev) => prev.includes(productoId)? prev.filter((id) => id !== productoId): [...prev, productoId]);
  };

  const handleEditar = (producto) => {
    setProductoEnEdicion(producto);
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      categoria: producto.categoria,
      imagen: producto.imagen
    });
    setMensajeError('');
  };

  const cancelar = () => {
    setProductoEnEdicion(null);
    setFormData({});
    setMensajeError('');
  };

  const modificacionInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const guardarCambios = async () => {
    try {
      setGuardando(true);
      setMensajeError('');

      if (!formData.nombre || !formData.precio || !formData.categoria || !formData.descripcion) {
        setMensajeError('Por favor completa: nombre, precio, categoría y descripción');
        setGuardando(false);
        return;
      }

      const precio = parseFloat(formData.precio);
      if (isNaN(precio) || precio < 0) {
        setMensajeError('Precio inválido (debe ser >= 0)');
        setGuardando(false);
        return;
      }

      await axios.put(
        `http://localhost:8000/api/productos/update/${productoEnEdicion.id}`,
        {
          nombre: formData.nombre,
          precio: precio,
          descripcion: formData.descripcion,
          categoria: formData.categoria,
          imagen: formData.imagen
        },
        { withCredentials: true }
      );

      if (onProductoActualizado) {
        onProductoActualizado();
      }

      setProductoEnEdicion(null);
      setFormData({});
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setMensajeError('Producto no encontrado');
      } else if (status === 400) {
        setMensajeError(err?.response?.data?.error || 'Datos inválidos');
      } else {
        setMensajeError('Error al guardar: ' + (err.message || 'desconocido'));
      }
    } finally {
      setGuardando(false);
    }
  };

  if (!Array.isArray(productosBase) || productosBase.length === 0) {
    return <div className="text-muted">No hay productos para mostrar.</div>;
  }

  return (
    <div className="lista-editar-productos">
      {productosBase.map((producto) => {
        const checked = seleccionados.includes(producto.id);
        const enEdicion = productoEnEdicion?.id === producto.id;

        return (
          <div key={producto.id}>
            <div className="fila-editar-producto">
              <input type="checkbox" className="check-editar-producto" checked={checked} onChange={() => seleccionar(producto.id)} disabled={estaOffline} />

              <img src={producto.imagen || 'imagenes/sinfoto.png'} alt={producto.nombre} className="imagen-editar-producto" />

              <div className="nombre-editar-producto">{producto.nombre}</div>

              <button type="button" className="btn btn-sm btn-primary" onClick={() => handleEditar(producto)} disabled={estaOffline}>
                {enEdicion ? 'Edicion' : 'Editar'}
              </button>
            
            </div>
            {enEdicion && (
            <div className="formulario-edicion-expandido">
                {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

                <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" name="nombre" value={formData.nombre || ''} onChange={modificacionInput} className="form-control"disabled={guardando}/>
                </div>

                <div className="mb-3">
                <label className="form-label">Precio</label>
                <input
                    type="number"
                    name="precio"
                    value={formData.precio || ''}
                    onChange={modificacionInput}
                    className="form-control"
                    step="0.01"
                    min="0"
                    disabled={guardando}
                />
                </div>

                <div className="mb-3">
                <label className="form-label">Descripcion</label>
                <textarea
                    name="descripcion"
                    value={formData.descripcion || ''}
                    onChange={modificacionInput}
                    className="form-control"
                    rows="3"
                    disabled={guardando}
                ></textarea>
                </div>

                <div className="mb-3">
                <label className="form-label">Categoria</label>
                <select
                    name="categoria"
                    value={formData.categoria || ''}
                    onChange={modificacionInput}
                    className="form-select"
                    disabled={guardando}
                >
                    <option value="">-- Selecciona --</option>
                    <option value="Flor">Flor</option>
                    <option value="Planta">Planta</option>
                    <option value="Ramo">Ramo</option>
                    <option value="Regalo">Regalo</option>
                    <option value="Accesorio">Accesorio</option>
                </select>
                </div>

                <div className="mb-3">
                <label className="form-label">URL Imagen</label>
                <input
                    type="text"
                    name="imagen"
                    value={formData.imagen || ''}
                    onChange={modificacionInput}
                    className="form-control"
                    disabled={guardando}
                />
                </div>

                <div className="d-flex gap-2">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelar}
                    disabled={guardando}
                >
                    Cancelar
                </button>
                <button type="button" className="btn btn-primary"
                    onClick={guardarCambios}
                    disabled={guardando}
                >
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
                </div>
            </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Editar_borrarProducto;
