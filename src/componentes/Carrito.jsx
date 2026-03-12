// src/componentes/Carrito.jsx
import { useState, useEffect } from 'react';
import { cargarCarrito, borrarDelCarrito } from '../tienda.js';

function Carrito() {
  const [productosCarrito, setProductosCarrito] = useState([]);
  
  // --- NUEVOS ESTADOS PARA EL CUPÓN ---
  const [codigoCupon, setCodigoCupon] = useState('');
  const [descuento, setDescuento] = useState(0); // 0 significa sin descuento, 0.10 será un 10%
  const [mensajeCupon, setMensajeCupon] = useState('');

  useEffect(() => {
    const actualizarCarrito = () => setProductosCarrito(cargarCarrito());
    actualizarCarrito();
    window.addEventListener('carritoActualizado', actualizarCarrito);
    return () => window.removeEventListener('carritoActualizado', actualizarCarrito);
  }, []);

  const manejarBorrado = (id) => {
    borrarDelCarrito(id);
    const carritoActualizado = productosCarrito.filter(producto => producto.id !== id);
    setProductosCarrito(carritoActualizado);
  };

  // --- NUEVA LÓGICA: APLICAR EL CUPÓN ---
  const manejarAplicarCupon = () => {
    // Definimos que nuestro código secreto es "DAWE10"
    if (codigoCupon.trim().toUpperCase() === 'DAWE10') {
      setDescuento(0.10); // Aplicamos un 10% de descuento
      setMensajeCupon('¡Cupón aplicado correctamente! (-10%)');
    } else {
      setDescuento(0); // Quitamos el descuento si se equivoca
      setMensajeCupon('Código no válido o caducado.');
    }
  };

  // --- NUEVA LÓGICA: CALCULAR TOTALES ---
  // Sumamos el precio de todos los productos
  const totalSinDescuento = productosCarrito.reduce((suma, prod) => suma + (prod.precio * (prod.cantidad || 1)), 0);
  // Calculamos cuánto dinero le descontamos
  const cantidadDescontada = totalSinDescuento * descuento;
  // Calculamos el total final a pagar
  const totalFinal = totalSinDescuento - cantidadDescontada;

  return (
    <section id="carrito" className="carrito-contenedor">
      <h2>Cesta de la compra</h2>
      
      {productosCarrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {productosCarrito.map((producto) => (
              <li key={producto.id} className="item-carrito">
                <img src={producto.imagen} alt={producto.nombre} width="50" />
                <div>
                  <p><strong>{producto.nombre}</strong></p>
                  <p>{producto.precio} € x {producto.cantidad || 1}</p>
                </div>
                <button onClick={() => manejarBorrado(producto.id)}>Eliminar</button>
              </li>
            ))}
          </ul>

          {/* --- NUEVA INTERFAZ DEL CUPÓN Y TOTALES --- */}
          <div className="seccion-totales" style={{ marginTop: '20px', borderTop: '2px solid #ccc', paddingTop: '10px' }}>
            <div className="zona-cupon">
              <label htmlFor="cupon">¿Tienes un cupón?</label>
              <input 
                type="text" 
                id="cupon"
                placeholder="Ej. DAWE10" 
                value={codigoCupon}
                onChange={(e) => setCodigoCupon(e.target.value)}
              />
              <button onClick={manejarAplicarCupon}>Aplicar</button>
              {/* Mostramos si el cupón fue exitoso o falló */}
              {mensajeCupon && <p style={{ fontSize: '0.9em', color: descuento > 0 ? 'green' : 'red' }}>{mensajeCupon}</p>}
            </div>

            <div className="resumen-precios" style={{ textAlign: 'right', marginTop: '10px' }}>
              <p>Subtotal: {totalSinDescuento.toFixed(2)} €</p>
              {descuento > 0 && (
                <p style={{ color: 'green' }}>Descuento (10%): -{cantidadDescontada.toFixed(2)} €</p>
              )}
              <h3>Total: {totalFinal.toFixed(2)} €</h3>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Carrito;