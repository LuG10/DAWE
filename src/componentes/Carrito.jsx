// src/componentes/Carrito.jsx
import { useState, useEffect } from 'react';
import { cargarCarrito, borrarDelCarrito } from '../tienda.js';

function Carrito() {
  const [productosCarrito, setProductosCarrito] = useState([]);
  
  // --- NUEVOS ESTADOS PARA EL CUPÓN ---
  const [codigoCupon, setCodigoCupon] = useState('');
  const [descuento, setDescuento] = useState(0); // 0 significa sin descuento, 0.10 será un 10%
  const [mensajeCupon, setMensajeCupon] = useState('');
  const [mensajeVisibleId, setMensajeVisibleId] = useState(null);

  useEffect(() => {
    const actualizarCarrito = () => setProductosCarrito(cargarCarrito());
    actualizarCarrito();
    window.addEventListener('carritoActualizado', actualizarCarrito);
    return () => window.removeEventListener('carritoActualizado', actualizarCarrito);
  }, []);

  const manejarBorrado = (id) => {
    setMensajeVisibleId(id);
    setTimeout(() => {
      const carritoActualizado = productosCarrito.filter(producto => producto.id !== id);
      setProductosCarrito(carritoActualizado);
      setMensajeVisibleId(null);
      borrarDelCarrito(id); // También borramos del almacenamiento local
    }, 2000);
    
    
    // Lo ocultamos a los 2 segundos
    setTimeout(() => {
      // Solo lo borramos si es el mismo (por si hace clic rápido en otro)
      setMensajeVisibleId((idActual) => idActual === id ? null : idActual);
    }, 2000); 
  };
    // --- NUEVA LÓGICA: CALCULAR TOTALES ---
  const totalSinDescuento = productosCarrito.reduce((suma, prod) => suma + (prod.precio * (prod.cantidad || 1)), 0);
  const totalFinal = totalSinDescuento * (1 - descuento);


  // --- NUEVA LÓGICA: APLICAR EL CUPÓN ---
  const manejarAplicarCupon = () => {
    // Definimos que nuestro código secreto es "FLORA20"
    if (codigoCupon.trim().toUpperCase() === 'FLORA20'&& totalSinDescuento>=150) { // Solo aplicamos si el total es mayor o igual a 150€
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
  
  // --- NUEVA LÓGICA: QUITAR CUPÓN SI EL PRECIO BAJA DE 150€ ---
  useEffect(() => {
    if (descuento > 0 && totalSinDescuento < 150) {
      setDescuento(0);
      setMensajeCupon('Cupón retirado: el pedido debe ser de al menos 150€.');
    }
  }, [totalSinDescuento, descuento]);


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
        {productosCarrito.map((item) => (
          <div key={item.id} className="d-flex mb-3 align-items-center item-carrito" style={{position:"relative"}}>
            <img src={item.imagen} width="60" className="me-2" alt={item.nombre} />

            <div className="flex-grow-1">
              <strong>{item.nombre}</strong><br />
              {item.precio} € x{" "}
              <input type="number" min="0" max="20" value={item.cantidad} className="cantidadCarrito" onChange={(e) => manejarCambioCantidad(item.id, e.target.value)}/>
              {" "} = <strong>{(item.precio * item.cantidad).toFixed(2)} €</strong>
            </div>

            <button type="button" className="btn-close me-3" style={{ fontSize: '0.6rem', opacity: 0.5 }} onClick={() => manejarBorrado(item.id)}></button>

            {/* --- Mensaje dentro del producto --- */}
            {mensajeVisibleId === item.id && (
              <div className="mensaje-flash visible">
                Eliminado del Carrito :)
              </div>
            )}

          </div>
        ))}
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