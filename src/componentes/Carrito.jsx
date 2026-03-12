import { useState, useEffect } from 'react';
// Importamos las funciones que ya tenéis creadas en tienda.js
import { cargarCarrito, borrarDelCarrito } from '../tienda.js';

function Carrito() {
  // 1. Creamos el estado para guardar los productos del carrito.
  // Empieza como un array vacío [].
  const [productosCarrito, setProductosCarrito] = useState([]);

  // 2. Usamos useEffect para cargar los datos del localStorage
  // y escuchar actualizaciones del carrito.
  useEffect(() => {
    // Función que carga los datos
    const actualizarCarrito = () => {
      setProductosCarrito(cargarCarrito());
    };

    // Cargamos la primera vez
    actualizarCarrito();

    // Nos quedamos "escuchando" por si alguien añade algo nuevo
    window.addEventListener('carritoActualizado', actualizarCarrito);

    // Limpiamos el escuchador si el componente desaparece
    return () => window.removeEventListener('carritoActualizado', actualizarCarrito);
  }, []);

  // 3. Función para manejar cuando el usuario hace clic en "Eliminar"
  const manejarBorrado = (id) => {
    // Lo borramos del localStorage usando vuestra función
    borrarDelCarrito(id);
    
    // Actualizamos el estado de React para que desaparezca de la pantalla
    // Filtramos el array para quedarnos con todos menos el que acabamos de borrar
    const carritoActualizado = productosCarrito.filter(producto => producto.id !== id);
    setProductosCarrito(carritoActualizado);
  };

  return (
    <section id="carrito" className="carrito-contenedor">
      <h2>Cesta de la compra</h2>
      
      {/* Si el carrito está vacío, mostramos un mensaje */}
      {productosCarrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        // Si hay productos, los recorremos con .map() para dibujarlos
        <ul>
          {productosCarrito.map((producto) => (
            // Cada elemento en una lista de React necesita una 'key' única
            <li key={producto.id} className="item-carrito">
              <img src={producto.imagen} alt={producto.nombre} width="50" />
              <div>
                <p><strong>{producto.nombre}</strong></p>
                <p>{producto.precio} € x {producto.cantidad || 1}</p>
              </div>
              <button onClick={() => manejarBorrado(producto.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Carrito;