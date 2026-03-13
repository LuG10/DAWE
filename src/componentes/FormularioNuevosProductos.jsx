// src/componentes/FormularioNuevosProductos.jsx
import { useState, useEffect } from 'react';
// Importamos la librería que acabamos de instalar en la terminal
import { FileUploader } from 'react-drag-drop-files';

const tiposArchivo = ["JPG", "PNG", "GIF", "JPEG"];
// el placebo holder del campo extra del formulario
const placeholders = {
  Flor: "Color",
  Ramo: "Tipo de ramo",
  Planta: "Ubicación",
  Accesorio: "Tamaño",
  Regalo: "Comida o bebida"
};

function FormularioNuevosProductos() {
  //estado para que los elemnetos de informacion adicional del formulario cambie 
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todo');
  //esto es para establecer la cantidad en le imput del precio del formulario
  const [precio, setPrecio] = useState(0);
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

      {/* Todo el formulario se oscurecerá si está offline gracias al estilo */}
      <form style={{ opacity: estaOffline ? 0.6 : 1 }}>
          <h2>Añadir Productos</h2>
          {/* El atributo disabled bloquea el campo si estaOffline es true */}
          <select id="categoria" name="categoria" className="form-control mb-2" value={categoriaSeleccionada} onChange={(e) => setCategoriaSeleccionada(e.target.value)}>
              <option value="Todo">Escoge un tipo</option>
              <option value="Flor">Flores</option>
              <option value="Ramo">Ramos</option>
              <option value="Planta">Plantas</option>
              <option value="Accesorio">Accesorios</option>
              <option value="Regalo">Regalos</option>
          </select>
        <input type="text" id="NombreProducto" name="NombreProducto" placeholder="Nombre" className="form-control mb-2" disabled={estaOffline} required/>
        <input type="number" id="precioProducto" name="precioProducto" placeholder="Precio" className="form-control mb-2" defaultValue={0}  onChange={(e) => setPrecio(Number(e.target.value))} required disabled={estaOffline}/>
        <textarea id="descripcion" name="descripcion" placeholder="Descripción" className="form-control mb-2" required disabled={estaOffline}></textarea>  
        {(categoriaSeleccionada !== 'Todo') && (
          <div id="contenedorExtra"> <input type="text" id="atributoExtra" name="atributoExtra"  placeholder={placeholders[categoriaSeleccionada]} className="form-control mb-2" disabled={estaOffline}/></div>
        )}        

        {/* --- ZONA DRAG & DROP --- */}
        {/* Si estamos offline, ponemos el fondo gris claro como pide el PDF */}
        <FileUploader 
            handleChange={manejarCambioArchivo} 
            name="file" 
            types={tiposArchivo}
            disabled={estaOffline}
            hoverTitle="Suelta la imagen"
            classes="file-uploader-container"
        >
            <div className={`zona-drag-drop ${estaOffline ? 'offline' : ''}`}>
                {archivo ? (
                  <div className='d-flex align-items-center p-2 border rounded bg-light' > 
                  <span style={{ fontSize: "2rem", marginRight: "10px" }}>📄</span>
                    <div>
                      <small className="d-block text-muted">Archivo seleccionado:</small>
                      <strong>{archivo.name}</strong>
                    </div>
                  </div>
                ) : (
                    <p>Seleccionar archivo o suelta la imagen aquí</p>
                )}
            </div>
        </FileUploader>

        <button type="submit" className="form-control mb-2 btn btn-primary" disabled={estaOffline}>Enviar</button>
      </form>
    </aside>
  );
}

export default FormularioNuevosProductos;