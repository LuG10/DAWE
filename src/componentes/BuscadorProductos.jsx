import { useState } from 'react';

function BuscadorProductos({ realizarBusqueda }) {
  const [textoBusqueda, setTextoBusqueda] = useState('');

  const manejarCambio = (evento) => {
    const nuevoTexto = evento.target.value;
    setTextoBusqueda(nuevoTexto);
    realizarBusqueda(nuevoTexto);
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h2>{textoBusqueda.trim() === '' ? 'Todos los productos' : `Buscar producto: ${textoBusqueda}`}</h2>
      <input type="text" id="buscador" className="form-control w-25" placeholder="Ej. Rosa, Bonsái..." value={textoBusqueda} onChange={manejarCambio} />
    </div>
  );
}

export default BuscadorProductos;