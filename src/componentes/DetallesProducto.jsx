// src/componentes/DetallesProducto.jsx
import { guardarEnCarrito } from '../tienda.js';

// Recibimos un "producto" por props para mostrar sus datos
function DetallesProducto({ producto, cerrarDetalles  }) {
  // Si no hay producto seleccionado, no mostramos nada
  if (!producto) return null;

  // Esta función se ejecuta al hacer clic en el botón
  const manejarAñadir = () => {
    // Nos aseguramos de que el producto tenga una cantidad inicial (p. ej. 1)
    const productoParaCarrito = { ...producto, cantidad: 1 };
    
    // Usamos TU función de tienda.js para guardarlo en el navegador
    guardarEnCarrito(productoParaCarrito);
    
    alert(`¡${producto.nombre} añadido al carrito!`);
    
    // (Opcional pero recomendado): Lanzamos un aviso para que el Carrito sepa que debe recargarse
    window.dispatchEvent(new Event('carritoActualizado'));
  };

  return (
    <div className="modal" onClick={cerrarDetalles}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <h2 id="tituloModal">{producto.nombre}</h2>
        <hr />
        <div className="info-cuerpo">
          <div className="row">
            <div className="col-md-4">
              <img src={producto.imagen} alt={producto.nombre} className="img-fluid" />
            </div>
            <div className="col-md-8 detalle-scroll">
              <h3 className="text-center">{producto.nombre}</h3>
              <p><strong>Precio: </strong><span>{producto.precio} €</span></p>
              {producto.extra && (
                <p><strong>Campo extra: </strong><span>{producto.extra}</span></p>
              )}
              <p><strong>Descripción: </strong><span>{producto.descripcion}</span></p>
              <button
                className="btn btn-primary mt-2"
                onClick={manejarAñadir}
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetallesProducto;