import { listaProductos, anadirAlCarrito, eliminarDelCarrito, carrito, actualizarCantidadCarrito} from './tienda.js';

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
            <div class="card h-100 shadow-sm position-relative">
                <button class="btn-carrito" data-id="${producto.id}"></button>
                <img src="${producto.imagen || 'imagenes/sinfoto.png'}"
                     class="card-img-top"
                     alt="${producto.nombre}"
                     style="height: 200px; object-fit: cover;"
                     onclick="abrirModal('${producto.nombre}', '${producto.precio}', '${extraInfo}', '${producto.descripcion}', '${producto.imagen}')">

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
    boton.addEventListener('click', (e) => {
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
    
    // 1. Calcular cuántos productos se muestran en la página actual
    const productosEnEstaPagina = (paginaActual === totalPaginas) 
        ? (total % PRODUCTOS_POR_PAGINA || PRODUCTOS_POR_PAGINA) 
        : PRODUCTOS_POR_PAGINA;

    const infoTexto = document.createElement('p');
    infoTexto.textContent = `Mostrando ${productosEnEstaPagina} de ${total} productos.`;
    paginacion.appendChild(infoTexto);

    // Contenedor para los botones 
    const nav = document.createElement('ul');
    nav.className = 'pagination-container'; 

    // 3. Botón "Anterior"
    if (paginaActual > 1) {
        nav.appendChild(crearBotonPaginacion('Anterior', paginaActual - 1));
    }

    // 4. Botones numéricos
    let inicioRango = Math.max(1, paginaActual - Math.floor(5 / 2));
    let finRango = inicioRango + 5 - 1;

    if (finRango > totalPaginas) {
        finRango = totalPaginas;
        inicioRango = Math.max(1, finRango - 5 + 1);
    }

    for (let i = inicioRango; i <= finRango; i++) {
        const li = crearBotonPaginacion(i, i, i === paginaActual);
        nav.appendChild(li);
}

    // 5. Botón "Siguiente"
    if (paginaActual < totalPaginas) {
        nav.appendChild(crearBotonPaginacion('Siguiente', paginaActual + 1));
    }
    paginacion.appendChild(nav);
}

function crearBotonPaginacion(texto, paginaDestino, esActivo = false) {
    const li = document.createElement('li');
    li.className = `page-item ${esActivo ? 'active' : ''}`;
    
    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#';
    a.textContent = texto;

    //cambian de página con cualquier boton de la paginacion
    a.addEventListener('click', (e) => {
        e.preventDefault();
        paginaActual = paginaDestino;
        renderizarTienda(listaProductos);
    });
    
    li.appendChild(a);
    return li;
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
        <button type="button" class="btn-close ms-2" aria-label="Close" 
            style="font-size: 0.6rem; opacity: 0.5;" 
            onclick="eliminarItem('${id}')">
        </button>
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


window.eliminarItem = function(id) {
    eliminarDelCarrito(id);
    actualizarCarrito();
};




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