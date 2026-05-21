import { useState } from 'react';
import axios from 'axios';
import { FileUploader } from 'react-drag-drop-files';

const tiposArchivo = ['JPG', 'PNG', 'GIF', 'JPEG'];

const deducirCategoria = (producto) => {
  if (producto?.categoria) return producto.categoria;
  if (producto?.tipo) return producto.tipo;

  const nombreClase = producto?.constructor?.name;
  if (['Flor', 'Ramo', 'Planta', 'Regalo', 'Accesorio'].includes(nombreClase)) {
    return nombreClase;
  }

  return '';
};

function Editar_borrarProducto({productosBase, estaOffline, onProductoActualizado}) {
  const [seleccionados, setSeleccionados] = useState([]);
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);
  const [formData, setFormData] = useState({});
  const [archivo, setArchivo] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeOk, setMensajeOk] = useState('');

  const seleccionar = (productoId) => {
    setSeleccionados((prev) => prev.includes(productoId)? prev.filter((id) => id !== productoId): [...prev, productoId]);
  };

  const handleEditar = (producto) => {
    setProductoEnEdicion(producto);
    const categoria = deducirCategoria(producto);
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      categoria: categoria,
      imagen: producto.imagen
    });
    setArchivo(null);
    setMensajeError('');
    setMensajeOk('');
  };

  const cancelar = () => {
    setProductoEnEdicion(null);
    setFormData({});
    setArchivo(null);
    setMensajeError('');
    setMensajeOk('');
  };

  const manejarCambioArchivo = (file) => {
    setArchivo(file);
  };

  const convertirA64 = (archivoLocal) => {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onload = () => resolve(lector.result);
      lector.onerror = reject;
      lector.readAsDataURL(archivoLocal);
    });
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
      setMensajeOk('');

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

      let imagenFinal = formData.imagen || 'imagenes/sinfoto.png';
      if (archivo) {
        imagenFinal = await convertirA64(archivo);
      }

      await axios.put(
        `/api/productos/update/${productoEnEdicion.id}`,
        {
          nombre: formData.nombre,
          precio: precio,
          descripcion: formData.descripcion,
          categoria: formData.categoria,
          tipo: formData.categoria,
          imagen: imagenFinal
        },
        { withCredentials: true }
      );

      if (onProductoActualizado) {
        onProductoActualizado();
      }

      setProductoEnEdicion(null);
      setFormData({});
      setArchivo(null);
      setMensajeOk('Producto actualizado correctamente.');
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

  const eliminarSeleccionados = async () => {
    if (seleccionados.length === 0) {
      setMensajeError('Selecciona al menos un producto para eliminar.');
      setMensajeOk('');
      return;
    }

    try {
      setGuardando(true);
      setMensajeError('');
      setMensajeOk('');

      const resultados = await Promise.allSettled(
        seleccionados.map((id) =>
          axios.delete(`/api/productos/eliminar/${id}`, { withCredentials: true })
        )
      );

      const eliminados = resultados.filter((r) => r.status === 'fulfilled').length;
      const fallidos = resultados.length - eliminados;

      if (eliminados > 0) {
        setMensajeOk(
          fallidos > 0
            ? `Se eliminaron ${eliminados} producto(s). ${fallidos} no estaban en la BBDD.`
            : `Se eliminaron ${eliminados} producto(s).`
        );
        setSeleccionados([]);
        setProductoEnEdicion(null);
        setFormData({});
        setArchivo(null);

        if (onProductoActualizado) {
          onProductoActualizado();
        }
      } else {
        setMensajeError('No se pudo eliminar ningún producto seleccionado.');
      }
    } catch (err) {
      setMensajeError('Error al eliminar productos.');
    } finally {
      setGuardando(false);
    }
  };

  if (!Array.isArray(productosBase) || productosBase.length === 0) {
    return <div className="text-muted">No hay productos para mostrar.</div>;
  }

  return (
    <div className="lista-editar-productos">
      <div className="d-flex align-items-center gap-2 mb-2">
        <button type="button" className="btn btn-sm btn-danger" onClick={eliminarSeleccionados} disabled={estaOffline || guardando || seleccionados.length === 0}>
          Eliminar seleccionados 
        </button>
      </div>

      {productosBase.map((producto) => {
        const checked = seleccionados.includes(producto.id);
        const enEdicion = productoEnEdicion?.id === producto.id;

        return (
          <div key={producto.id} className='edicionProducto'>
            <div className="fila-editar-producto">
              <input type="checkbox" className="check-editar-producto" checked={checked} onChange={() => seleccionar(producto.id)} disabled={estaOffline} />

              <img src={producto.imagen || 'imagenes/sinfoto.png'} alt={producto.nombre} className="imagen-editar-producto" />

              <div className="nombre-editar-producto">{producto.nombre}</div>

              <button type="button" className="btn btn-sm btn-primary" onClick={() => handleEditar(producto)} disabled={estaOffline}>
                 Editar
              </button>
            
            </div>
            {enEdicion && (
            <div className="formulario-edicion-expandido">
                <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" name="nombre" value={formData.nombre || ''} onChange={modificacionInput} className="form-control"disabled={guardando}/>
                </div>

                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input type="number" name="precio" value={formData.precio || ''} onChange={modificacionInput} className="form-control" step="0.01" min="0" disabled={guardando}/>
                </div>

                <div className="mb-3">
                    <label className="form-label">Descripcion</label>
                    <textarea name="descripcion" value={formData.descripcion || ''} onChange={modificacionInput} className="form-control" rows="3" disabled={guardando}></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Categoria</label>
                    <select name="categoria" value={formData.categoria || ''} onChange={modificacionInput} className="form-select" disabled={guardando}>
                        <option value="">-- Selecciona --</option>
                        <option value="Flor">Flor</option>
                        <option value="Planta">Planta</option>
                        <option value="Ramo">Ramo</option>
                        <option value="Regalo">Regalo</option>
                        <option value="Accesorio">Accesorio</option>
                    </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Imagen</label>
                  <FileUploader handleChange={manejarCambioArchivo} name="file" types={tiposArchivo} disabled={estaOffline || guardando} hoverTitle="Suelta la imagen" classes="file-uploader-container">
                    <div className={`zona-drag-drop ${(estaOffline || guardando) ? 'offline' : ''}`}>
                      {archivo ? (
                        <div className="d-flex align-items-center p-2 border rounded bg-light">
                          <div>
                            <small className="d-block text-muted">Archivo seleccionado:</small>
                            <strong>{archivo.name}</strong>
                          </div>
                        </div>
                      ) : formData.imagen ? (
                        <div className="d-flex align-items-center gap-3 p-2 border rounded bg-light">
                          <img
                            src={formData.imagen}
                            alt="Imagen actual del producto"
                            style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.15)' }}
                          />
                          <div>
                            <small className="d-block text-muted">Imagen actual</small>
                            <small className="text-muted">Selecciona otra si quieres reemplazarla</small>
                          </div>
                        </div>
                      ) : (
                        <p>Seleccionar archivo o suelta la imagen aqui</p>
                      )}
                    </div>
                  </FileUploader>
                </div>

                <div className="d-flex gap-2">
                    <button type="button" className="btn btn-secondary" onClick={cancelar} disabled={guardando}>
                        Cancelar
                    </button>
                    <button type="button" className="btn btn-primary" onClick={guardarCambios} disabled={guardando}>
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
