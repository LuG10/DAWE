import { useState } from 'react';
import { listaProductos } from './tienda.js';

import PWABadge from './PWABadge.jsx';
import Cabecera from './componentes/Cabecera.jsx';
import MenuNavegacion from './componentes/MenuNavegacion.jsx';
import EscaparateProductos from './componentes/EscaparateProductos.jsx';
import FormularioNuevosProductos from './componentes/FormularioNuevosProductos.jsx';
import Carrito from './componentes/Carrito.jsx';
import Pie from './componentes/Pie.jsx';
import './App.css';



function App() {

  return (
    // Devolvemos el contenedor principal que centra todo
    <div className="container border-top border-bottom marcoPrin min-vh-100 d-flex flex-column">
      
      <Cabecera titulo="Floristería Flora" />
      <MenuNavegacion />
      
      {/* Usamos las columnas de Bootstrap que tenías en la iteración 1 */}
      <div className="row flex-grow-1 mt-4">
        
        {/* Columna Izquierda (7 huecos): Escaparate (que ahora lleva dentro el buscador) */}
        <main className="col-md-7">
          <EscaparateProductos />
        </main>

        {/* Columna Derecha (5 huecos): Formulario */}
        <aside className="col-md-5">
          <FormularioNuevosProductos/>
        </aside>

      </div>

      <Carrito/>
      <Pie contenido="© 2026 Floristeria Flora. Todos los derechos reservados." />
      
      <PWABadge />
    </div>
  );
}

export default App;