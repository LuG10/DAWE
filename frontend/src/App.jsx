// src/App.jsx
import { useState, useEffect } from 'react';


import './App.css';

import PWABadge from './PWABadge.jsx';
import Cabecera from './componentes/Cabecera.jsx';
import MenuNavegacion from './componentes/MenuNavegacion.jsx';
import EscaparateProductos from './componentes/EscaparateProductos.jsx';
import FormularioNuevosProductos from './componentes/FormularioNuevosProductos.jsx';
import Carrito from './componentes/Carrito.jsx';
import Pie from './componentes/Pie.jsx';
import GenerarRamo from './componentes/GenerarRamo.jsx';
import DetallesUsuario from './componentes/DetallesUsuario.jsx';
import Aside from './componentes/Aside.jsx';
import axios from 'axios';
import Editar_borrarProducto from './componentes/Editar_borrarProducto.jsx';
import { crearProducto } from './tienda.js';



function App() {
  const [verSoloFlores, setVerSoloFlores] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [seccion, setSeccion] = useState("escaparate");
  const [user, setUser] = useState(null);
  const [visits, setVisits] = useState(0);
  const [productosBase, setProductosBase] = useState([]);
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

  const recargarProductos = () => {
    axios.get('http://localhost:8000/api/productos')
      .then(res => {
        if (Array.isArray(res.data)) {
          const instancias = res.data.map(p =>crearProducto(p.tipo, p.nombre, p.precio, p.descripcion, p.imagen, p.color, p.atributoExtra));
          setProductosBase(instancias);
          return;
        }
        setProductosBase([]);
      })
      .catch(() => {
        setProductosBase([]);
      });
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;
    const hadSession = localStorage.getItem('hadSession') === '1';
    if (hadSession) {
      axios.get('http://localhost:8000/api/usuarios/me')
        .then(res => setUser(res.data))
        .catch(err => {
          if (err?.response?.status === 401) {
            localStorage.removeItem('hadSession');
            setUser(null);
            return;
          }
          // Si es 404, simplemente no hay usuario logueado, no mostrar error en consola
          if (err?.response?.status === 404) {
            setUser(null);
            return;
          }
          console.log('Error checking logged user', err);
        });
    } else {
      setUser(null);
    }

    axios.get('http://localhost:8000/api/visits')
      .then(res => setVisits(res.data.visits))
      .catch(err => console.log('Error getting visits', err));

    recargarProductos();
  }, []);

  const renderizarSeccion = () => {
    switch (seccion) {
      case "escaparate":
        return <EscaparateProductos 
          verSoloFlores={verSoloFlores}
          paginaActual={paginaActual}  
          cambiarPagina={setPaginaActual} 
          productosBase={productosBase}
        />;
      case "formulario":
        return (
          <FormularioNuevosProductos
            onProductoCreado={recargarProductos}
            estaOffline={estaOffline}
          />
        );
      case "misDatos":
        return <DetallesUsuario setUser={setUser} user={user} estaOffline={estaOffline}/>;
      case "editar_borrarProductos":
        return <Editar_borrarProducto productosBase={productosBase} estaOffline={estaOffline} onProductoActualizado={recargarProductos}/>;
      default:
        return null;
    }
  };
      
  return (
    <div className="container border-top border-bottom marcoPrin min-vh-100 d-flex flex-column">
      <Cabecera titulo="Floristería Flora" />
      <MenuNavegacion
        cambiarSeccion={setSeccion}
        cambiarPagina={setPaginaActual}
        setVerSoloFlores={setVerSoloFlores}
        user={user}
        estaOffline={estaOffline}
      />
      
      <div className="row flex-grow-1 mt-4">
        {renderizarSeccion()}
        {seccion === "escaparate" && (
          <aside className="col-md-4">
            {verSoloFlores ? (
              <GenerarRamo
                setVerSoloFlores={setVerSoloFlores}
                cambiarPagina={setPaginaActual}
                productosBase={productosBase}
              />
            ) : (
              <Aside setUser={setUser} user={user} estaOffline={estaOffline} visits={visits} />
            )}
          </aside>
        )}
      </div>

      <Carrito/>
      <Pie contenido="© 2026 Floristeria Flora. Todos los derechos reservados." />
      
      <PWABadge />
    </div>
  );
}

export default App;