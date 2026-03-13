import { useState, useEffect } from 'react';
// IMPORTANTE: He añadido DIVISA aquí para que no dé error
import { listaProductos, buscarProductos, DIVISA, guardarEnCarrito } from '../tienda.js'; 

import BuscadorProductos from './BuscadorProductos.jsx';
import Paginacion from './Paginacion.jsx';
import DetallesProducto from './DetallesProducto.jsx';


//---------------------------------------------------------------//
//           Funciones realizadas en este Componente             //
//---------------------------------------------------------------//

function EscaparateProductos() {
  const [productosFiltrados, setProductosFiltrados] = useState(listaProductos);
  const [paginaActual, setPaginaActual] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const PRODUCTOS_POR_PAGINA = 6;
  const totalProductos = productosFiltrados.length;
  const totalPaginas = Math.ceil(totalProductos / PRODUCTOS_POR_PAGINA); 

  const indiceUltimoProducto = paginaActual * PRODUCTOS_POR_PAGINA;
  const indicePrimerProducto = indiceUltimoProducto - PRODUCTOS_POR_PAGINA;
  const productosMostrados = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);

  const manejarBusqueda = (texto) => {
    const resultados = buscarProductos(texto);
    setProductosFiltrados(resultados);
    setPaginaActual(1); 
  };

  const anadirCarro = (producto) => {
    const productoConCantidad = { ...producto, cantidad: 1 };
    setTimeout(() => {
      window.dispatchEvent(new Event("carritoActualizado"));
    }, 0);
  };

  useEffect(() => {
    const actualizar = () => setProductosFiltrados([...listaProductos]);
    actualizar();
    window.addEventListener("productosActualizados", actualizar);
    return () => window.removeEventListener("productosActualizados", actualizar);
  }, []);




//---------------------------------------------------------------//
//                   Devolucion del componente                   //
//---------------------------------------------------------------//

  return (
    <section id="escaparate">
      
      {/* Agrupamos título y buscador en la misma línea como en la iteración 1 */}
      <BuscadorProductos realizarBusqueda={manejarBusqueda} />


      {/* Recuperamos la CUADRÍCULA BOOTSTRAP para las tarjetas */}
      <div id="contenedorProductos" className="row row-cols-1 row-cols-md-3 g-4">
        {productosMostrados.map((producto, index) => (
          <div key={index} className="col">
            <div className="card h-100 shadow-sm position-relative producto">
              
              <button className="btn-carrito" onClick={() => anadirCarro(producto)}></button>
              
              <img 
                src={`/${producto.imagen || 'imagenes/sinfoto.png'}`} 
                className="card-img-top" 
                alt={producto.nombre} 
                style={{ height: '200px', objectFit: 'cover' }} 
              />
              
              <div className="card-body d-flex flex-column">
                <h5 className="card-title nombre-producto">{producto.nombre}</h5>
                <p className="fw-bold mb-1">{producto.precio} {DIVISA}</p>
                <p className="card-text descripcion-producto">{producto.descripcion}</p>
                
                {/* Botón Detalles */}
                <button className="btn btn-primary mt-auto" onClick={() => setProductoSeleccionado(producto)}>
                  Ver detalles
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Paginación con margen superior */}
      
      <Paginacion 
        paginaActual={paginaActual} 
        totalPaginas={totalPaginas} 
        productosMostrados={productosMostrados.length} 
        totalProductos={totalProductos} 
        cambiarPagina={setPaginaActual} 
      />
      
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