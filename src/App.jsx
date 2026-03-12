// src/App.jsx
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
    <>
      {/* Pasamos el título por props como pide el PDF */}
      <Cabecera titulo="Floristeria Flora" />
      <MenuNavegacion />
      
      <main className="contenedor-principal">
        {/* Aquí agrupamos las secciones principales de la tienda */}
        <EscaparateProductos />
        <FormularioNuevosProductos />
        <Carrito />
      </main>

      {/* Pasamos el contenido por props al pie */}
      <Pie contenido="© 2026 Floristeria Flora. Todos los derechos reservados." />
      
      <PWABadge />
    </>
  );
}

export default App;