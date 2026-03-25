function DetallesProducto({ producto, cerrarDetalles }) {

  if (!producto) return null;

  return (
    <div className="modal" onClick={cerrarDetalles}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <h2 id="tituloModal">{producto.nombre}</h2>
        <hr />
        <div className="info-cuerpo">
          <div className="row">
            <div className="col-md-4">
              <img src={producto.imagen} alt={producto.nombre} className="img-fluid" />
            </div>
            <div className="col-md-8 detalle-scroll">
              <h3 className="text-center">{producto.nombre}</h3>
              <p><strong>Precio: </strong><span>{producto.precio} €</span></p>
              {producto.extra && (
                <p><strong>Campo extra: </strong><span>{producto.extra}</span></p>
              )}
              <p><strong>Descripción: </strong><span>{producto.descripcion}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetallesProducto;