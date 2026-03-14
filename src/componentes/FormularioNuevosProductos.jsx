// src/componentes/FormularioNuevosProductos.jsx
import { useState, useEffect } from 'react';
import { FileUploader } from 'react-drag-drop-files';

import { crearProducto, guardarElemento} from '../tienda.js'

const tiposArchivo = ["JPG", "PNG", "GIF", "JPEG"];
const placeholders = {
  Flor: "Color",
  Ramo: "Tipo de ramo",
  Planta: "Ubicación",
  Accesorio: "Tamaño",
  Regalo: "Comida o bebida"
};

function FormularioNuevosProductos() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [atributoExtra, setAtributoExtra] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todo');
  const [precio, setPrecio] = useState(0);
  const [estaOffline, setEstaOffline] = useState(!navigator.onLine);
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

  const convertirA64 = (archivo) => {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onload = () => resolve(lector.result);
      lector.onerror = reject;
      lector.readAsDataURL(archivo);
    });
  };

  const añadirElemento = async (e) => {
    e.preventDefault();
    let imagenFinal = "imagenes/sinfoto.png";
    if (archivo) {
      imagenFinal = await convertirA64(archivo);
    }
    const nuevoProducto = crearProducto(
      categoriaSeleccionada,
      nombre,
      precio,
      descripcion,
      imagenFinal,
      atributoExtra
    );
    if (!nuevoProducto) return;
    const productoPlano = nuevoProducto.toPlainObject();
    guardarElemento(productoPlano);
    window.dispatchEvent(new Event("productosActualizados"));
    setNombre("");
    setDescripcion("");
    setAtributoExtra("");
    setPrecio(0);
    setArchivo(null);
    setCategoriaSeleccionada("Todo");
  };

  return (
    <aside className="formulario-lateral">
      <form id="FormularioProd" style={{ opacity: estaOffline ? 0.6 : 1 }} onSubmit={añadirElemento}>
        <h2>Añadir Productos</h2>
        <select id="categoria" name="categoria" className="form-control mb-2" value={categoriaSeleccionada} onChange={(e) => setCategoriaSeleccionada(e.target.value)} disabled={estaOffline}>
            <option value="">Escoge un tipo</option>
            <option value="Flor">Flores</option>
            <option value="Ramo">Ramos</option>
            <option value="Planta">Plantas</option>
            <option value="Accesorio">Accesorios</option>
            <option value="Regalo">Regalos</option>
        </select>
        <input type="text" name="NombreProducto" placeholder="Nombre" className="form-control mb-2" value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={estaOffline} required/>
        <input type="number"  name="precioProducto" placeholder="Precio" className="form-control mb-2" defaultValue={0}  onChange={(e) => setPrecio(Number(e.target.value))} required disabled={estaOffline}/>
        <textarea id="descripcion" name="descripcion" placeholder="Descripción" className="form-control mb-2" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required disabled={estaOffline}></textarea>  
        {(categoriaSeleccionada !== 'Todo' && categoriaSeleccionada !== '') && (
          <div id="contenedorExtra"> <input type="text" id="atributoExtra" name="atributoExtra" placeholder={placeholders[categoriaSeleccionada]} className="form-control mb-2"  value={atributoExtra} onChange={(e) => setAtributoExtra(e.target.value)}disabled={estaOffline}/></div>
        )}        

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

        <button type="submit" disabled={estaOffline}>Enviar</button>
      </form>
    </aside>
  );
}

export default FormularioNuevosProductos;