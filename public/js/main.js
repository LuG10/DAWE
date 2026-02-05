import { listaProductos, anadirAlCarrito, carrito, actualizarCantidadCarrito} from './tienda.js';

// 6 productos por página
export const PRODUCTOS_POR_PAGINA = 6;
export let paginaActual = 1;

document.addEventListener('DOMContentLoaded', () => {
    renderizarTienda(listaProductos);
});

export function renderizarTienda(productos) {
    const contenedor = document.getElementById('contenedorProductos');
    contenedor.innerHTML = '';

    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const fin = inicio + PRODUCTOS_POR_PAGINA;
    const productosPagina = productos.slice(inicio, fin);

    productosPagina.forEach(producto => {

        // Campo extra según tipo
        let extraInfo = '';
        if (producto.tipoFlor) extraInfo = `Tipo: ${producto.tipoFlor}`;
        else if (producto.color) extraInfo = `Color: ${producto.color}`;
        else if (producto.ubicacion) extraInfo = `Ubicación: ${producto.ubicacion}`;
        else if (producto.material) extraInfo = `Material: ${producto.material}`;
        else if (producto.categoria) extraInfo = `Categoría: ${producto.categoria}`;
        console.log(producto.id)
        const htmlProducto = `
        <div class="col">
            <div class="card h-100 shadow-sm position-relative" onclick="abrirModal('${producto.nombre}', '${producto.precio}', '${extraInfo}', '${producto.descripcion}', '${producto.imagen}')">
                <button class="btn-carrito" data-id="${producto.id}"></button>
                <img src="${producto.imagen || 'imagenes/sinfoto.png'}"
                     class="card-img-top"
                     alt="${producto.nombre}"
                     style="height: 200px; object-fit: cover;">

                <div class="card-body d-flex flex-column">
                    <h5 class="card-title nombre-producto">
                        ${producto.nombre}
                    </h5>

                    <p class="fw-bold mb-1">
                        ${producto.precio} €
                    </p>

                    <p class="text-muted small mb-2">
                        ${extraInfo}
                    </p>

                    <p class="card-text descripcion-producto">
                        ${producto.descripcion}
                    </p>
                </div>
            </div>
        </div>
        `;

        contenedor.insertAdjacentHTML('beforeend', htmlProducto);
    });

    actualizarPaginacion(productos.length);

    document.querySelectorAll('.btn-carrito').forEach(boton => {
    boton.addEventListener('click', () => {
        const idProducto = boton.dataset.id;
        anadirAlCarrito(idProducto);
        actualizarCarrito();

        //para que nos salga el texto de producto añadido:
        const mensaje = document.createElement('div');
        mensaje.classList.add('anadido-carrito-mensaje');
        mensaje.textContent = 'Añadido al carrito :)';
        boton.parentElement.appendChild(mensaje);
        console.log("mensaje añadido");
        //forzamos porque si no no funciona
        mensaje.offsetHeight;
        mensaje.classList.add('visible');
        console.log("antes del timeout");
        setTimeout(() => {
            mensaje.classList.remove('visible'); //esto es para que no se vea transparente
            setTimeout(() => mensaje.remove(), 300);
        }, 1500);
        console.log("Producto añadido al carrito:", idProducto);
    });
});
}

function actualizarPaginacion(total) {
    const paginacion = document.getElementById('paginacion');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(total / PRODUCTOS_POR_PAGINA);

    for (let i = 1; i <= totalPaginas; i++) {
        const activo = i === paginaActual ? 'active' : '';
        paginacion.innerHTML += `
            <li class="page-item ${activo}">
                <a class="page-link" href="#">${i}</a>
            </li>`;
    }

    document.querySelectorAll('#paginacion a').forEach((a, index) => {
        a.addEventListener('click', e => {
            e.preventDefault();
            paginaActual = index + 1;
            renderizarTienda(listaProductos);
        });
    });
}
function actualizarCarrito() {
    const contenedor = document.getElementById("contenidoCarrito");
    const totalSpan = document.getElementById("totalCarrito");
   contenedor.innerHTML = "";
   let total = 0;
   let hayProductos = false;

   for (const id in carrito) {
     const item = carrito[id];
     hayProductos = true;

     const subtotal = item.precio * item.cantidad;
     total += subtotal;
     contenedor.innerHTML += `
      <div class="d-flex mb-3 align-items-center">
        <img src="${item.imagen}" width="60" class="me-2">
        <div class="flex-grow-1">
          <strong>${item.nombre}</strong><br>
          ${item.precio} € x 
          <input type="number" min="0" max="20" value="${item.cantidad}" class="cantidadCarrito" data-id="${id}">
          = <strong>${subtotal} €</strong>
        </div>
      </div>
    `;
  }

  if (!hayProductos) {
    contenedor.innerHTML = `<p class="text-center text-muted">El carrito está vacío</p>`;
  }

  totalSpan.textContent = total + "€";
  actualizarCarrito
  // Añadir event listeners a los inputs de cantidad
   document.querySelectorAll(".cantidadCarrito").forEach(input => {
    input.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      let cantidad = parseInt(e.target.value);

      if (isNaN(cantidad)) cantidad = 0;

      actualizarCantidadCarrito(id, cantidad);
      actualizarCarrito();
    });
  });
}


window.abrirModal = function(nombre, precio, extra, descripcion, url) {
    const modal = document.getElementById("modal");
    precio = precio +"€"
    document.getElementById("NombreProductoModal").innerText = nombre;
    document.getElementById("PrecioProductoModal").innerText = precio;
    document.getElementById("ExtraProductoModal").innerText = extra;
    document.getElementById("Descripcion").innerText = descripcion;
    document.getElementById('modal-imagen').src = url;

    modal.style.display = "flex";
};


window.cerrarModal = function() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
};


window.addEventListener('click', function(event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        cerrarModal();
    }
});