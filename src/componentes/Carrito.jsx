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
    // Definimos que nuestro código secreto es "FLORA20"
    if (codigoCupon.trim().toUpperCase() === 'FLORA20') {
      setDescuento(0.20); // Aplicamos un 20% de descuento
      setMensajeCupon('¡Cupón aplicado correctamente! (-20%)');
    } else {
      setDescuento(0); // Quitamos el descuento si se equivoca
      setMensajeCupon('Código no válido o caducado.');
    }
  };

  const manejarCambioCantidad = (id, nuevaCantidad) => {
    const cantidad = Number(nuevaCantidad);

    if (cantidad <= 0) {
      borrarDelCarrito(id);
      setProductosCarrito(productosCarrito.filter(producto => producto.id !== id));
      return;
    }

    const carritoActualizado = productosCarrito.map(producto =>
      producto.id === id ? { ...producto, cantidad } : producto
    );

    setProductosCarrito(carritoActualizado);

    const productoActualizado = carritoActualizado.find(producto => producto.id === id);
    localStorage.setItem('producto_' + id, JSON.stringify(productoActualizado));
  };

  // --- NUEVA LÓGICA: CALCULAR TOTALES ---
  const totalSinDescuento = productosCarrito.reduce((suma, prod) => suma + (prod.precio * (prod.cantidad || 1)), 0);
  const totalFinal = totalSinDescuento * (1 - descuento);

  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="carritoOffcanvas" aria-labelledby="carritoLabel">
      {/* --- HEADER --- */}
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="carritoLabel">
          Carrito de la compra
        </h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>

      {/* --- BODY --- */}
      <div id="contenidoCarrito">
        {productosCarrito.length === 0 ? (
          <p className="text-center text-muted">Tu carrito está vacío.</p>
        ) : (
          productosCarrito.map((item) => (
            <div key={item.id} className="d-flex mb-3 align-items-center item-carrito">
              <img src={item.imagen} width="60" className="me-2" alt={item.nombre} />

              <div className="flex-grow-1">
                <strong>{item.nombre}</strong><br />
                {item.precio} € x{" "}
                <input type="number" min="0" max="20" value={item.cantidad} className="cantidadCarrito" onChange={(e) => manejarCambioCantidad(item.id, e.target.value)}
                />
                {" "} = <strong>{(item.precio * item.cantidad).toFixed(2)} €</strong>
              </div>

              {/* Se ha cambiado ms-2 por me-3 para mover la X un poco más a la izquierda */}
              <button type="button" className="btn-close me-3" style={{ fontSize: '0.6rem', opacity: 0.5 }} onClick={() => manejarBorrado(item.id)}
              ></button>
            </div>
          ))
        )}
      </div>

      {/* --- CUPÓN Y TOTALES --- */}
      <div className="mt-3 border-top pt-2">
        <input type="text" id="cupon" name="cuponDescuento" placeholder="Añade tu cupón de descuento" value={codigoCupon} className="form-control mb-2" onChange={(e) => setCodigoCupon(e.target.value)}/>
        <button id="aplicarCupon" className="btn btn-success w-100" onClick={manejarAplicarCupon}>Aplicar cupón</button>

        {mensajeCupon && (
          <p className="text-center mt-1" style={{ fontSize: '0.8em', color: descuento > 0 ? 'green' : 'red' }}>
            {mensajeCupon}
          </p>
        )}

        <div className="resumen-precios text-end mt-2 pe-3">
          {descuento > 0 ? (
            <>
              {/* Precio original tachado en gris */}
              <p className="mb-0" style={{ textDecoration: 'line-through', color: 'gray', fontSize: '1.1rem' }}>
                {totalSinDescuento.toFixed(2)} €
              </p>
              {/* Precio nuevo debajo CON LA PALABRA TOTAL */}
              <h3 style={{ color: 'black' }}>Total: {totalFinal.toFixed(2)} €</h3>
            </>
          ) : (
            <h3>Total: {totalSinDescuento.toFixed(2)} €</h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrito;