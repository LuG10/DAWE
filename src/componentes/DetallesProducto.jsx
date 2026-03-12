// src/componentes/DetallesProducto.jsx
import { guardarEnCarrito } from '../tienda.js';

// Recibimos un "producto" por props para mostrar sus datos
function DetallesProducto({ producto }) {
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
    <div className="capa-detalles">
      <div className="recuadro-detalles">
        <h3>{producto.nombre}</h3>
        <img src={producto.imagen} alt={producto.nombre} width="150" />
        <p><strong>Precio:</strong> {producto.precio} €</p>
        <p>{producto.descripcion}</p>
        
        {/* Botón que llama a nuestra función */}
        <button onClick={manejarAñadir}>
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}

export default DetallesProducto;