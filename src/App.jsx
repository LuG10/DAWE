// src/App.jsx
import { useState } from 'react';
import { listaProductos } from './tienda.js';

import PWABadge from './PWABadge.jsx';
import Cabecera from './componentes/Cabecera.jsx';
import MenuNavegacion from './componentes/MenuNavegacion.jsx';
import EscaparateProductos from './componentes/EscaparateProductos.jsx';
import FormularioNuevosProductos from './componentes/FormularioNuevosProductos.jsx';
import Carrito from './componentes/Carrito.jsx';
import Pie from './componentes/Pie.jsx';
import GenerarRamo from './componentes/GenerarRamo.jsx';
import './App.css';

function App() {
  const [verSoloFlores, setVerSoloFlores] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);

  return (
    <div className="container border-top border-bottom marcoPrin min-vh-100 d-flex flex-column">
      
      <Cabecera titulo="Floristería Flora" />
      <MenuNavegacion />
      
      <div className="row flex-grow-1 mt-4">
        <EscaparateProductos 
          verSoloFlores={verSoloFlores}
          paginaActual={paginaActual}  
          cambiarPagina={setPaginaActual} 
        />
        <aside className="col-md-5">
          {verSoloFlores ? (
            <GenerarRamo setVerSoloFlores={setVerSoloFlores} cambiarPagina={setPaginaActual}/>
          ) : (
            <FormularioNuevosProductos setVerSoloFlores={setVerSoloFlores} cambiarPagina={setPaginaActual}/>
          )}
        </aside>
      </div>

      <Carrito/>
      <Pie contenido="© 2026 Floristeria Flora. Todos los derechos reservados." />
      
      <PWABadge />
    </div>
  );
}

export default App;