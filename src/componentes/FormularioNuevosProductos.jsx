// src/componentes/FormularioNuevosProductos.jsx
import { useState, useEffect } from 'react';
// Importamos la librería que acabamos de instalar en la terminal
import { FileUploader } from 'react-drag-drop-files';

const tiposArchivo = ["JPG", "PNG", "GIF", "JPEG"];

function FormularioNuevosProductos() {
  // Volvemos a detectar el estado offline para bloquear el formulario
  const [estaOffline, setEstaOffline] = useState(!navigator.onLine);
  // Estado para guardar la imagen que se arrastre
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    const manejarOffline = () => setEstaOffline(true);
    const manejarOnline = () => setEstaOffline(false);
    window.addEventListener('offline', manejarOffline);
    window.addEventListener('online', manejarOnline);
    return () => {
      window.removeEventListener('offline', manejarOffline);
      window.removeEventListener('online', manejarOnline);
    };
  }, []);

  const manejarCambioArchivo = (file) => {
    setArchivo(file);
  };

  return (
    <aside className="formulario-lateral">
      <h2>Añadir productos</h2>
      
      {/* Todo el formulario se oscurecerá si está offline gracias al estilo */}
      <form style={{ opacity: estaOffline ? 0.6 : 1 }}>
        <div>
          <label>Escoge un tipo</label>
          {/* El atributo disabled bloquea el campo si estaOffline es true */}
          <select className="form-control mb-2" disabled={estaOffline}>
            <option>Flor</option>
            <option>Planta</option>
            <option>Ramo</option>
          </select>
        </div>
        
        <div>
          <label>Nombre</label>
          <input type="text" className="form-control mb-2" disabled={estaOffline} />
        </div>
        
        <div>
          <label>Precio</label>
          <input type="number" disabled={estaOffline} />
        </div>
        
        <div>
          <label>Descripción</label>
          <textarea className="form-control mb-2" disabled={estaOffline}></textarea>
        </div>

        {/* --- ZONA DRAG & DROP --- */}
        {/* Si estamos offline, ponemos el fondo gris claro como pide el PDF */}
        <div style={{ 
          backgroundColor: estaOffline ? 'lightgray' : 'transparent',
          marginTop: '15px',
          padding: '10px',
          border: '1px dashed #ccc'
        }}>
          <FileUploader 
            handleChange={manejarCambioArchivo} 
            name="file" 
            types={tiposArchivo}
            disabled={estaOffline} // Se deshabilita si no hay conexión
            hoverTitle="Suelta la imagen" // Mensaje que aparece AL ARRASTRAR por encima
          >
            {/* Diseño personalizado del recuadro, no dejamos el de defecto */}
            <div className="zona-drag-drop">
              <p>Seleccionar archivo o suelta la imagen aquí</p>
              {archivo ? <p>Archivo: {archivo.name}</p> : <p>Sin archivos seleccionados</p>}
            </div>
          </FileUploader>
        </div>

        <button type="submit" className="btn btn-primary form-control mb-2" disabled={estaOffline} style={{ marginTop: '15px' }}>
          Subir producto
        </button>
      </form>
    </aside>
  );
}

export default FormularioNuevosProductos;