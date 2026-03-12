
function Paginacion({ 
  paginaActual, 
  totalPaginas, 
  productosMostrados, 
  totalProductos, 
  cambiarPagina 
}) {
  
  // Si la búsqueda no devuelve ningún producto, mostramos un mensaje alternativo
  if (totalProductos === 0) {
    return (
      <div className="paginacion">
        <p>No hay productos para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="paginacion-contenedor">
      {/* Mensaje que muestra el número de productos mostrados y el total */}
      <p className="resumen-productos">
        Mostrando {productosMostrados} de {totalProductos} productos
      </p>

      {/* Botones de paginación */}
      <div className="controles-paginacion">
        <button 
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1} // Se deshabilita si estamos en la primera página
        >
          Anterior
        </button>

        <span className="indicador-pagina">
          Página {paginaActual} de {totalPaginas}
        </span>

        <button 
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas} // Se deshabilita si estamos en la última página
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Paginacion;