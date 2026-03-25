import { useState, useEffect } from 'react';

function MenuNavegacion() {
  const [estaOffline, setEstaOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const manejarOffline = () => setEstaOffline(true);
    const manejarOnline = () => setEstaOffline(false);

    window.addEventListener('offline', manejarOffline);
    window.addEventListener('online', manejarOnline);

    return () => {
      window.removeEventListener('offline', manejarOffline);
      window.removeEventListener('online', manejarOnline);
    };
  }, []);

  return (
    <nav>
      <div className='navegador'>
      <ul>
        <li><a href="#" className="text-decoration-none">Menú</a></li>
        <li><a href="#carrito" className="text-decoration-none" data-bs-toggle="offcanvas" data-bs-target="#carritoOffcanvas">Carro de la compra</a></li>
      </ul>

      {estaOffline && (
        <div className="alerta-offline" style={{ backgroundColor: 'red', color: 'white', border: '1px solid white', padding: '5px 10px',fontWeight: 'bold'}}>
          Estás offline
        </div>
      )}
      </div>
    </nav>
  );
}

export default MenuNavegacion;