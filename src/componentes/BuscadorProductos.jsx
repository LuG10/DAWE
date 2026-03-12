// src/componentes/BuscadorProductos.jsx
import { useState } from 'react';

// Recibimos la función 'realizarBusqueda' que nos pasa el EscaparateProductos por props
function BuscadorProductos({ realizarBusqueda }) {
  // Creamos un estado local para guardar lo que el usuario escribe en la caja de texto
  const [textoBusqueda, setTextoBusqueda] = useState('');

  // Esta función se ejecuta cada vez que el usuario teclea o borra una letra
  const manejarCambio = (evento) => {
    const nuevoTexto = evento.target.value;
    setTextoBusqueda(nuevoTexto); // Actualizamos lo que se ve en la caja de texto
    
    // Le enviamos el nuevo texto al EscaparateProductos para que filtre el catálogo
    // y nos devuelva a la página 1 automáticamente.
    realizarBusqueda(nuevoTexto);
  };

  return (
    <div className="buscador-contenedor">
      {/* Título de la sección de búsqueda como pide el PDF */}
      <h2>Buscar Productos</h2>
      
      <div className="campo-busqueda">
        <label htmlFor="buscador">Nombre del producto: </label>
        <input 
          type="text" 
          id="buscador"
          placeholder="Ej. Rosa, Bonsái..." 
          value={textoBusqueda}
          onChange={manejarCambio} // Conectamos el input con nuestra función
        />
      </div>
      
      {/* Opcional: Mostrar un mensajito de lo que se está buscando */}
      {textoBusqueda && (
        <p>Mostrando resultados para: <strong>{textoBusqueda}</strong></p>
      )}
    </div>
  );
}

export default BuscadorProductos;