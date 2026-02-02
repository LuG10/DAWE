import { listaProductos } from './tienda.js';

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

        const htmlProducto = `
        <div class="col">
            <div class="card h-100 shadow-sm">

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
