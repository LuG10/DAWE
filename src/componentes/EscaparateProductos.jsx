// src/componentes/EscaparateProductos.jsx
import { useState, useEffect } from 'react';
import { listaProductos, buscarProductos, DIVISA, guardarEnCarrito, cargarCatalogo } from '../tienda.js'; 
import BuscadorProductos from './BuscadorProductos.jsx';
import Paginacion from './Paginacion.jsx';
import DetallesProducto from './DetallesProducto.jsx';

function EscaparateProductos() {
  const [productosFiltrados, setProductosFiltrados] = useState(listaProductos);
  const [paginaActual, setPaginaActual] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  // NUEVO ESTADO: Guarda el ID del producto que acaba de ser clickeado
  const [mensajeVisibleId, setMensajeVisibleId] = useState(null);

  const PRODUCTOS_POR_PAGINA = 6;
  const totalProductos = productosFiltrados.length;
  const totalPaginas = Math.ceil(totalProductos / PRODUCTOS_POR_PAGINA); 

  const indiceUltimoProducto = paginaActual * PRODUCTOS_POR_PAGINA;
  const indicePrimerProducto = indiceUltimoProducto - PRODUCTOS_POR_PAGINA;
  const productosMostrados = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);

  const manejarBusqueda = (texto) => {
    const creados = cargarCatalogo();
    const todos = [...listaProductos, ...creados];
    const resultados = todos.filter(p =>
      p.nombre.toLowerCase().includes(texto.toLowerCase())
    );
    setProductosFiltrados(resultados);
    setPaginaActual(1);
  };

  const anadirCarro = (producto) => {
    const base = producto.toPlainObject ? producto.toPlainObject() : (producto.toJSON ? producto.toJSON() : { ...producto });
    const productoConCantidad = { ...base, cantidad: 1 };
    guardarEnCarrito(productoConCantidad);
    window.dispatchEvent(new Event("carritoActualizado"));

    // NUEVO: Mostramos el mensaje en esta tarjeta específica
    setMensajeVisibleId(producto.id);
    
    // Lo ocultamos a los 2 segundos
    setTimeout(() => {
      // Solo lo borramos si es el mismo (por si hace clic rápido en otro)
      setMensajeVisibleId((idActual) => idActual === producto.id ? null : idActual);
    }, 2000); 
  };

  useEffect(() => {
    const actualizar = () => {
      const creados = cargarCatalogo();
      setProductosFiltrados([...listaProductos, ...creados]);
    };
    actualizar();
    window.addEventListener("productosActualizados", actualizar);
    return () => window.removeEventListener("productosActualizados", actualizar);
  }, []);

  return (
    <section id="escaparate">
      <BuscadorProductos realizarBusqueda={manejarBusqueda} />

      <div id="contenedorProductos" className="row row-cols-1 row-cols-md-3 g-4">
        {productosMostrados.map((producto) => (
          <div key={producto.id} className="col">
            <div className="card h-100 shadow-sm position-relative producto">
              
              <button className="btn-carrito" onClick={() => anadirCarro(producto)}></button>
              
              {/* AQUÍ ESTÁ EL MENSAJE: Si el ID coincide con el clickeado, le ponemos la clase "visible" */}
              <div className={`mensaje-flash ${mensajeVisibleId === producto.id ? 'visible' : ''}`}>
                Añadido al carrito :)
              </div>

              <img 
                src={producto.imagen || 'imagenes/sinfoto.png'} 
                className="card-img-top" 
                alt={producto.nombre} 
                style={{ height: '200px', objectFit: 'cover' }} 
              />
              
              <div className="card-body d-flex flex-column">
                <h5 className="card-title nombre-producto">{producto.nombre}</h5>
                <p className="fw-bold mb-1">{producto.precio} {DIVISA}</p>
                <p className="card-text descripcion-producto">{producto.descripcion}</p>
                
                <div className="mt-auto d-flex flex-column gap-2">
                  <button className="btn btn-primary" onClick={() => setProductoSeleccionado(producto)}>
                    Ver detalles
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      
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