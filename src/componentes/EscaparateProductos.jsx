// src/componentes/EscaparateProductos.jsx
import { useState } from 'react';
// Importamos la base de datos inicial y la función de búsqueda que ya tenéis creadas
import { listaProductos, buscarProductos } from '../tienda.js'; 

import BuscadorProductos from './BuscadorProductos.jsx';
import Paginacion from './Paginacion.jsx';
import DetallesProducto from './DetallesProducto.jsx';

function EscaparateProductos() {
  // 1. Estados (la memoria del componente)
  // Guardamos los productos que se están mostrando (inicialmente todos)
  const [productosFiltrados, setProductosFiltrados] = useState(listaProductos);
  // Guardamos la página en la que estamos (empezamos en la 1)
  const [paginaActual, setPaginaActual] = useState(1);
  // Guardamos qué producto se ha seleccionado para ver sus detalles (null = ninguno)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // 2. Lógica de Paginación
  const PRODUCTOS_POR_PAGINA = 6; // Puedes cambiar este número
  const totalProductos = productosFiltrados.length;
  // Calculamos el total de páginas redondeando hacia arriba
  const totalPaginas = Math.ceil(totalProductos / PRODUCTOS_POR_PAGINA); 

  // Averiguamos qué trozo del array de productos toca mostrar en esta página
  const indiceUltimoProducto = paginaActual * PRODUCTOS_POR_PAGINA;
  const indicePrimerProducto = indiceUltimoProducto - PRODUCTOS_POR_PAGINA;
  const productosMostrados = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);

  // 3. Función para cuando el usuario busca un producto
  const manejarBusqueda = (texto) => {
    // Usamos vuestra función de tienda.js
    const resultados = buscarProductos(texto);
    setProductosFiltrados(resultados);
    // Al buscar algo nuevo, siempre volvemos a la página 1 como pide el PDF
    setPaginaActual(1); 
  };

  return (
    <section id="escaparate">
      
      {/* Le pasamos al buscador la función para que nos avise cuando haya texto nuevo */}
      <BuscadorProductos realizarBusqueda={manejarBusqueda} />

      {/* Dibujamos el catálogo con los productos correspondientes a la página actual */}
      <div className="catalogo" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {productosMostrados.map((producto, index) => (
          // Usamos el nombre (o id si lo tenéis) como clave única para React
          <div key={index} className="tarjeta-producto" style={{ border: '1px solid #ccc', padding: '10px' }}>
            <img src={producto.imagen} alt={producto.nombre} width="150" />
            <h3>{producto.nombre}</h3>
            <p>{producto.precio} €</p>
            {/* Al hacer clic, guardamos este producto en el estado para abrir el modal de detalles */}
            <button onClick={() => setProductoSeleccionado(producto)}>
              Ver detalles
            </button>
          </div>
        ))}
      </div>

      {/* Insertamos la paginación de Maira pasándole todos los datos que necesita */}
      <Paginacion 
        paginaActual={paginaActual} 
        totalPaginas={totalPaginas} 
        productosMostrados={productosMostrados.length} 
        totalProductos={totalProductos} 
        cambiarPagina={setPaginaActual} 
      />

      {/* Si hay un producto seleccionado, se lo pasamos al componente de Detalles. 
          También pasamos una forma de cerrarlo (ponerlo a null de nuevo) */}
      {productoSeleccionado && (
        <DetallesProducto 
          producto={productoSeleccionado} 
          cerrarDetalles={() => setProductoSeleccionado(null)}
        />
      )}

    </section>
  );
}

export default EscaparateProductos;