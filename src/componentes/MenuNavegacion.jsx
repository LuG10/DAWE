// src/componentes/MenuNavegacion.jsx
import { useState, useEffect } from 'react';

function MenuNavegacion() {
  // Estado para saber si estamos offline o no. 
  // Por defecto, le preguntamos al navegador cómo está la conexión ahora mismo.
  const [estaOffline, setEstaOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Funciones que cambian el estado cuando se va o vuelve la conexión
    const manejarOffline = () => setEstaOffline(true);
    const manejarOnline = () => setEstaOffline(false);

    // Le decimos al navegador que nos avise de los cambios
    window.addEventListener('offline', manejarOffline);
    window.addEventListener('online', manejarOnline);

    // Limpiamos los avisos si el componente desaparece
    return () => {
      window.removeEventListener('offline', manejarOffline);
      window.removeEventListener('online', manejarOnline);
    };
  }, []);

  return (
    <nav className="menu-navegacion" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <ul>
        <li><a href="#">Inicio</a></li>
        <li><a href="#carrito">Cesta de la compra</a></li>
      </ul>

      {/* Si estamos offline, mostramos el cartel rojo que pide el PDF */}
      {estaOffline && (
        <div 
          className="alerta-offline" 
          style={{ 
            backgroundColor: 'red', 
            color: 'white', 
            border: '1px solid white', 
            padding: '5px 10px',
            fontWeight: 'bold'
          }}
        >
          Estás offline
        </div>
      )}
    </nav>
  );
}

export default MenuNavegacion;