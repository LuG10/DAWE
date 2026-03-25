
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
      <div className="pagination-container pagination pagination-sm justify-content-center">
        <p>No hay productos para mostrar.</p>
      </div>
    );
  }

  //---------------------------------------------------------------//
  //              Botones centrales de la paginacion               //
  //---------------------------------------------------------------//

  const maxBotones = 5;
  let inicioRango = Math.max(1, paginaActual - Math.floor(maxBotones / 2));
  let finRango = inicioRango + maxBotones - 1;

  if (finRango > totalPaginas) {
    finRango = totalPaginas;
    inicioRango = Math.max(1, finRango - maxBotones + 1);
  }

  const botonesCentrales = [];
  for (let i = inicioRango; i <= finRango; i++) {
    botonesCentrales.push(
       <li key={i} className={`page-item ${i === paginaActual ? 'active' : ''}`}>
        <a className="page-link"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            cambiarPagina(i);
          }}
        >
          {i}
        </a>
      </li>
    );
  }
 

  return (
    <nav className="mt-4 paginacion-container">
        <p className="pagination-info">
          Mostrando {productosMostrados} de {totalProductos} productos
        </p>
      <ul className="pagination-container pagination pagination-sm justify-content-center">
        {paginaActual > 1 && (
          <li className="page-item">
            <a
              className="page-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                cambiarPagina(paginaActual - 1);
              }}
            >
              Anterior
            </a>
          </li>
        )}

        {botonesCentrales}

        {paginaActual < totalPaginas && (
          <li className="page-item">
            <a
              className="page-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                cambiarPagina(paginaActual + 1);
              }}
            >
              Siguiente
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Paginacion;