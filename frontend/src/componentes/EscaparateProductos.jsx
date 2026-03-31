import { useState, useEffect } from 'react';
import { buscarProductos, DIVISA, guardarEnCarrito } from '../tienda.js'; 
import BuscadorProductos from './BuscadorProductos.jsx';
import Paginacion from './Paginacion.jsx';
import DetallesProducto from './DetallesProducto.jsx';
import AvisoCupon from './AvisoCupon.jsx';
import { Flor } from '../clases/Flor.js';

function EscaparateProductos({ verSoloFlores, paginaActual, cambiarPagina, productosBase }) {
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  const [mensajeVisibleId, setMensajeVisibleId] = useState(null);

  const PRODUCTOS_POR_PAGINA = 6;

  const productosFiltradosPorCategoria = verSoloFlores ? productosFiltrados.filter(p => p instanceof Flor || p.categoria === "Flor"): productosFiltrados;

  const indiceUltimoProducto = paginaActual * PRODUCTOS_POR_PAGINA;
  const indicePrimerProducto = indiceUltimoProducto - PRODUCTOS_POR_PAGINA;
  const productosMostrados = productosFiltradosPorCategoria.slice(indicePrimerProducto, indiceUltimoProducto);

  const totalProductos = productosFiltradosPorCategoria.length;
  const totalPaginas = Math.ceil(totalProductos / PRODUCTOS_POR_PAGINA); 

  const obtenerCatalogoActual = () => productosBase;

  const manejarBusqueda = (texto) => {
    const todos = obtenerCatalogoActual();
    const resultados = buscarProductos(texto, todos);
    setProductosFiltrados(resultados);
    cambiarPagina(1);
  };

  const anadirCarro = (producto) => {
    const base = producto.toPlainObject ? producto.toPlainObject() : { ...producto };
    const productoConCantidad = { ...base, cantidad: 1 };
    guardarEnCarrito(productoConCantidad);
    window.dispatchEvent(new Event("carritoActualizado"));

    setMensajeVisibleId(producto.id);
    
    setTimeout(() => {
      setMensajeVisibleId((idActual) => idActual === producto.id ? null : idActual);
    }, 2000); 
  };

  useEffect(() => {
    const actualizar = () => {
      setProductosFiltrados(obtenerCatalogoActual());
    };

    actualizar();
    window.addEventListener("productosActualizados", actualizar);
    return () => window.removeEventListener("productosActualizados", actualizar);
  }, [productosBase]);

  return (
    <main className="col-md-8">
      <BuscadorProductos realizarBusqueda={manejarBusqueda} />
      <AvisoCupon/>
      <div id="contenedorProductos" className="row row-cols-3 g-4">
        {productosMostrados.map((producto) => (
          <div key={producto.id} className="col">
            <div className="card h-100 shadow-sm position-relative producto" draggable={verSoloFlores}  onDragStart={(e) => e.dataTransfer.setData("idFlor", producto.id)}>
              {!verSoloFlores && (
                <div>
                  <button className="btn-carrito" onClick={() => anadirCarro(producto)}></button>
                  <div className={`mensaje-flash ${mensajeVisibleId === producto.id ? 'visible' : ''}`}>
                    Añadido al carrito :)
                  </div>
                </div>
              )}
              <img src={producto.imagen || 'imagenes/sinfoto.png'} className={`card-img-top ${productoSeleccionado?.id === producto.id ? 'seleccionado' : ''}`} alt={producto.nombre} style={{ height: '200px', objectFit: 'cover' }} onClick={() => setProductoSeleccionado(producto)} draggable="false"/>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title nombre-producto">{producto.nombre}</h5>
                <p className="fw-bold mb-1">{producto.precio} {DIVISA}</p>
                <p className="card-text descripcion-producto">{producto.descripcion}</p>
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
        cambiarPagina={cambiarPagina} 
      />
      
      {productoSeleccionado && (
        <DetallesProducto 
          producto={productoSeleccionado} 
          cerrarDetalles={() => setProductoSeleccionado(null)}
        />
      )}
    </main>
  );
}

export default EscaparateProductos;