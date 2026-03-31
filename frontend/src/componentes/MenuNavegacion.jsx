function MenuNavegacion({ cambiarSeccion, cambiarPagina, setVerSoloFlores, user, estaOffline }) {

  return (
    <nav>
      <div className='navegador'>
      <ul>
        <li><a href="#" className="text-decoration-none" onClick={() => {cambiarSeccion("escaparate"); cambiarPagina(1); setVerSoloFlores(false);}}>Menú</a></li>
        <li><a href="#carrito" className="text-decoration-none" data-bs-toggle="offcanvas" data-bs-target="#carritoOffcanvas">Carro de la compra</a></li>
        <li><a href="#" className='text-decoration-none' onClick={() => { cambiarSeccion("escaparate"); cambiarPagina(1); setVerSoloFlores(true); }}>Generar ramo</a></li>
        {user && (
          <li><a href="#" className="text-decoration-none" onClick={() => cambiarSeccion("misDatos")}>Mi cuenta</a></li>
        )}
        {user?.role === 'admin' && (
          <>
            <li><a href="#" className="text-decoration-none" onClick={() => cambiarSeccion("formulario")}>Añadir un producto</a></li>
            <li><a href="#" className="text-decoration-none" onClick={() => cambiarSeccion("editar_borrarProductos")}>Editar/Borrar Productos</a></li>
          </>
        )}
        
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