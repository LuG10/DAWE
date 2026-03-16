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
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h2>{textoBusqueda.trim() === '' ? 'Todos los productos' : `Buscar producto: ${textoBusqueda}`}</h2>
      <input 
        type="text" 
        id="buscador"
        className="form-control w-25"
        placeholder="Ej. Rosa, Bonsái..." 
        value={textoBusqueda}
        onChange={manejarCambio}
      />
    </div>
  );
}

export default BuscadorProductos;