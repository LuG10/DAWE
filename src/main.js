// ======================================================
// 1. IMPORTACIONES
// ======================================================

import {
    listaProductos,
    anadirAlCarrito,
    eliminarDelCarrito,
    carrito,
    actualizarCantidadCarrito,
    buscarProductos,
    crearProducto
} from './tienda.js';

import { RamoPersonalizado } from './clases/RamoPersonalizado.js';
import { Flor } from './clases/Flor.js';


// ======================================================
// 2. VARIABLES GLOBALES
// ======================================================

export const PRODUCTOS_POR_PAGINA = 6;
export let paginaActual = 1;

let cuponAplicado = false;
let totalCarrito = 0;


// ======================================================
// 3. INICIALIZACIÓN
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
    renderizarTienda(listaProductos);
});


// ======================================================
// 4. RENDERIZADO DE TIENDA
// ======================================================

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

        console.log(producto.id);

        const htmlProducto = `
        <div class="col">
            <div class="card h-100 shadow-sm position-relative producto ${modoRamo ? 'ramo-mode' : ''}" 
                 draggable="${modoRamo ? 'true' : 'false'}" 
                 data-id="${producto.id}">

                ${modoRamo ? '' : `<button class="btn-carrito" data-id="${producto.id}"></button>`}

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

    // Botones añadir al carrito
    document.querySelectorAll('.btn-carrito').forEach(boton => {
        boton.addEventListener('click', () => {

            const idProducto = boton.dataset.id;

            anadirAlCarrito(idProducto);
            actualizarCarrito();

            // Mensaje flash
            const mensaje = document.createElement('div');
            mensaje.classList.add('mensaje-flash');
            mensaje.textContent = 'Añadido al carrito :)';
            boton.parentElement.appendChild(mensaje);

            mensaje.offsetHeight;
            mensaje.classList.add('visible');

            setTimeout(() => {
                mensaje.classList.remove('visible');
                setTimeout(() => mensaje.remove(), 300);
            }, 1500);

            console.log("Producto añadido al carrito:", idProducto);
        });
    });
}


// ======================================================
// 5. PAGINACIÓN
// ======================================================

function actualizarPaginacion(total) {

    const paginacion = document.getElementById('paginacion');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(total / PRODUCTOS_POR_PAGINA);

    const productosEnEstaPagina =
        (paginaActual === totalPaginas)
            ? (total % PRODUCTOS_POR_PAGINA || PRODUCTOS_POR_PAGINA)
            : PRODUCTOS_POR_PAGINA;

    const infoTexto = document.createElement('p');
    infoTexto.textContent = `Mostrando ${productosEnEstaPagina} de ${total} productos.`;
    paginacion.appendChild(infoTexto);

    const nav = document.createElement('ul');
    nav.className = 'pagination-container';

    // Botón anterior
    if (paginaActual > 1) {
        nav.appendChild(crearBotonPaginacion('Anterior', paginaActual - 1));
    }

    // Botones numéricos
    let inicioRango = Math.max(1, paginaActual - Math.floor(5 / 2));
    let finRango = inicioRango + 5 - 1;

    if (finRango > totalPaginas) {
        finRango = totalPaginas;
        inicioRango = Math.max(1, finRango - 5 + 1);
    }

    for (let i = inicioRango; i <= finRango; i++) {
        nav.appendChild(crearBotonPaginacion(i, i, i === paginaActual));
    }

    // Botón siguiente
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

    a.addEventListener('click', (e) => {
        e.preventDefault();
        paginaActual = paginaDestino;

        if (modoRamo) {
            const flores = listaProductos.filter(p => p instanceof Flor);
            renderizarTienda(flores);
        } else {
            renderizarTienda(listaProductos);
        }
    });

    li.appendChild(a);
    return li;
}


export function resetearPagina() {
    paginaActual = 1;
}


// ======================================================
// 6. CARRITO
// ======================================================

export function actualizarCarrito() {

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
        totalCarrito = total;

        contenedor.innerHTML += `
        <div class="d-flex mb-3 align-items-center">
            <img src="${item.imagen}" width="60" class="me-2">
            <div class="flex-grow-1">
                <strong>${item.nombre}</strong><br>
                ${item.precio} € x 
                <input type="number" min="0" max="20" value="${item.cantidad}" 
                       class="cantidadCarrito" data-id="${id}">
                = <strong>${subtotal} €</strong>
            </div>
            <button type="button" class="btn-close ms-2"
                style="font-size: 0.6rem; opacity: 0.5;"
                onclick="eliminarItem('${id}')">
            </button>
        </div>
        `;
    }

    if (!hayProductos) {
        contenedor.innerHTML = `<p class="text-center text-muted">El carrito está vacío</p>`;
    }

    if (cuponAplicado && total >= 150) {

        const precioConDescuento = total * 0.80;

        totalSpan.innerHTML = `
            <span class="text-decoration-line-through text-muted me-2">
                ${total.toFixed(2)}€
            </span>
            <span>
                ${precioConDescuento.toFixed(2)}€
            </span>
        `;

    } else {
        totalSpan.textContent = total.toFixed(2) + "€";
    }

    // Actualizar cantidades
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


// ======================================================
// 7. FUNCIONES GLOBALES (MODAL / ELIMINAR)
// ======================================================

window.eliminarItem = function(id) {
    eliminarDelCarrito(id);
    actualizarCarrito();
};

window.abrirModal = function(nombre, precio, extra, descripcion, url) {

    const modal = document.getElementById("modal");

    document.getElementById("NombreProductoModal").innerText = nombre;
    document.getElementById("PrecioProductoModal").innerText = precio + "€";
    document.getElementById("ExtraProductoModal").innerText = extra;
    document.getElementById("Descripcion").innerText = descripcion;
    document.getElementById("modal-imagen").src = url;

    modal.style.display = "flex";
};

window.cerrarModal = function() {
    document.getElementById("modal").style.display = "none";
};

window.addEventListener('click', function(event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) cerrarModal();
});


// ======================================================
// 8. BUSCADOR
// ======================================================

function buscarProductosEnTienda(query) {
    const resultados = buscarProductos(query);
    paginaActual = 1;
    renderizarTienda(resultados);
}

const titulo = document.getElementById("titulo-producto");

document.getElementById("buscador").addEventListener("input", (e) => {

    const query = e.target.value;

    titulo.textContent = query === ""
        ? "Todos los productos"
        : `Buscando por: ${query}`;

    buscarProductosEnTienda(query);
});


// ======================================================
// 9. CUPÓN DE DESCUENTO
// ======================================================

document.addEventListener('DOMContentLoaded', () => {

    const botonCupon = document.getElementById("aplicarCupon");

    if (botonCupon) {
        botonCupon.addEventListener("click", () => {

            const cuponInput = document.getElementById("cuponDescuento");
            const cupon = cuponInput.value.trim().toUpperCase();

            const esCodigoCorrecto = (cupon === "FLORA20");
            const compraMinimaAlcanzada = (totalCarrito >= 150);
            const noHaSidoUsado = (!cuponAplicado);

            if (esCodigoCorrecto && noHaSidoUsado && compraMinimaAlcanzada) {

                cuponAplicado = true;
                actualizarCarrito();
                mostrarMensajeFlash(cuponInput, '¡Cupón aplicado! -20%', 'exito');

            } else {

                let mensajeError = "";

                if (!esCodigoCorrecto)
                    mensajeError = "El código del cupón no es válido";
                else if (!noHaSidoUsado)
                    mensajeError = "¡Ya has aplicado este cupón!";
                else if (!compraMinimaAlcanzada)
                    mensajeError = "El pedido debe ser superior a 150€ para aplicar el cupón";

                mostrarMensajeFlash(cuponInput, mensajeError, 'error');
            }
        });
    }

    function mostrarMensajeFlash(elementoPadre, texto, tipo) {

        const mensajeAnterior = elementoPadre.parentElement.querySelector('.mensaje-flash');
        if (mensajeAnterior) mensajeAnterior.remove();

        const mensaje = document.createElement('div');
        mensaje.classList.add('mensaje-flash');

        if (tipo === 'error') {
            mensaje.classList.add('error');
        }

        mensaje.textContent = texto;
        elementoPadre.parentElement.appendChild(mensaje);

        mensaje.offsetHeight;
        mensaje.classList.add('visible');

        setTimeout(() => {
            mensaje.classList.remove('visible');
            setTimeout(() => mensaje.remove(), 300);
        }, 3000);
    }
});


// ======================================================
// 10. AÑADIR PRODUCTO A LA LISTA DE PRODUCTOS
// ======================================================

var fileselect = document.getElementById("fileselect");
var dropbox = document.getElementById("dropbox");
const form = document.getElementById("FormularioProd");

let archivoSeleccionado = null;
let timeoutError = null;

dropbox.addEventListener("dragenter", dragOverAP); 
dropbox.addEventListener("dragexit", dragOverAP); 
dropbox.addEventListener("dragover", dragOverAP); 
dropbox.addEventListener("drop", gestorFicheros); 
fileselect.addEventListener("change", gestorFicheros); 

function dragOverAP(evt) {
    evt.stopPropagation();
    evt.preventDefault(); 
    if (dropbox.classList.contains("archivo-cargado")) return; 
    dropbox.classList.toggle("hover", evt.type === "dragover");
}

function gestorFicheros(e) {
    e.preventDefault();
    e.stopPropagation();

    var files = e.target.files || e.dataTransfer.files;
    if (files.length > 1) { 
        dropbox.classList.remove("hover");
        mostrarError("Solo puedes subir un archivo."); 
        return; 
    }

    const file = files[0];

    if (!file.type.match(/image\/(jpeg|jpg|png)/)) { 
        dropbox.classList.remove("hover");
        mostrarError("Formato no válido. Solo se permiten JPG, JPEG o PNG."); 
        return; 
    }

    archivoSeleccionado =  file;
    mostrarIconoArchivo();
}

function mostrarIconoArchivo() {
  dropbox.classList.add("archivo-cargado");
  dropbox.classList.remove("hover");

  dropbox.innerHTML = "";

  const fileBadge = document.createElement("div");
  fileBadge.className = "d-flex align-items-center p-2 border rounded bg-light";
  fileBadge.style.width = "fit-content";

  fileBadge.innerHTML = `
    <span style="font-size: 2rem; margin-right: 10px;">📄</span>
    <div>
      <small class="d-block text-muted">Archivo seleccionado:</small>
      <strong>${archivoSeleccionado.name}</strong>
    </div>
    <button type="button" class="btn-close ms-3" onclick="resetFile()" aria-label="Close"></button>
  `;

  dropbox.appendChild(fileBadge);
}



form.addEventListener("submit", function (e) {
  e.preventDefault();
  const aviso = document.getElementById("categoriaAviso");
  const categoria = document.getElementById("categoria");
  const tipo = categoria.value;
  const nombre = document.getElementById("NombreProducto").value;
  const precio = document.getElementById("precioProducto").value;
  const descripcion = document.getElementById("descripcion").value;
  const atributoExtra = document.getElementById("atributoExtra").value;
  const imagen = "imagenes/sinfoto.png";


  if (!archivoSeleccionado !== null){
    imagen = URL.createObjectURL(archivoSeleccionado);
  }

  if (tipo==="Todo"){
     categoria.classList.add("input-error"); 
     aviso.style.display = "block"; 
     return;
  }
  categoria.classList.remove("input-error"); 
  aviso.style.display = "none";

  if (!nombre || !precio || !descripcion){
    return;
  }
  
  crearProducto(tipo, nombre, precio, descripcion, imagen, atributoExtra);
  
  renderizarTienda(listaProductos);
  form.reset(); 
  dropbox.innerHTML = "";
  archivoSeleccionado = null;
});


function resetFile() {
  dropbox.classList.remove("archivo-cargado");  
  dropbox.className = "dropbox"
  dropbox.innerHTML = "Arrastra aquí los ficheros";
  fileselect.value = "";
}

window.resetFile = resetFile;


function mostrarError(msg) { 
  const errorBox = document.getElementById("errorArchivo"); 
  errorBox.textContent = msg; 
  errorBox.style.display = "block"; 
  clearTimeout(timeoutError); 
  timeoutError = setTimeout(() => { errorBox.style.display = "none"; }, 3000); 
}

// ======================================================
// 11. GENERACION DEL ELEMENTO EXTRA EN FORMULARIO
// ======================================================

const selector = document.getElementById("categoria");
const contenedorExtra = document.getElementById("contenedorExtra");
const inputExtra = document.getElementById("atributoExtra");

const categoriasVisibles = ["Flor", "Planta", "Ramo", "Accesorio", "Regalo"];

const placeholders = {
    Flor: "Color",
    Ramo: "Tipo de ramo",
    Planta: "Ubicación",
    Accesorio: "Tamaño",
    Regalo: "Comida o bebida"
};

function comprobarClase() {
    const valor = selector.value;

    if (categoriasVisibles.includes(valor)) {
        contenedorExtra.style.display = "block";
        inputExtra.required = true;
        inputExtra.placeholder = placeholders[valor] || "Información adicional";
    } else {
        contenedorExtra.style.display = "none";
        inputExtra.required = false;
        inputExtra.value = "";
        inputExtra.placeholder = "";
    }
}

document.addEventListener("DOMContentLoaded", comprobarClase);

selector.addEventListener("change", comprobarClase);


// ======================================================
// 12. FUNCIONALIDAD 1: GENERAR UN RAMO PERSONALIZADO
// ======================================================

export let modoRamo = false;

const ramo = new RamoPersonalizado();

const ramoPers = document.getElementById("ramoPersonalizado"); 
const contadorFlores = document.getElementById("contadorFlores");
const contadorPrecio = document.getElementById("contadorPrecio");  
const btn = document.getElementById("btnRamoPersonalizado");
const contenedorR = document.getElementById("contenedorRamo");
const formu = document.querySelector("#FormularioProd");
const btn_cancel = document.getElementById("btnCancelarRamo");
const btn_carrito = document.getElementById("btnGuardarRamo");

ramoPers.addEventListener("dragover", dragOverGR); 
ramoPers.addEventListener("drop", anadirFlor); 

btn.addEventListener("click", comenzarRamo);

btn_cancel.addEventListener("click", restaurar);

btn_carrito.addEventListener("click", añadirCarrito)

//------------------listener para qe las flores se consideren arrastrables---------------//

document.addEventListener("dragstart", e => { 
    if (!modoRamo) return;
    const card = e.target.closest(".producto");
    if (!card) return;
    e.dataTransfer.setData("idFlor", card.dataset.id);
});

function dragOverGR(evt) {
  evt.preventDefault(); 
}


//---------------------añadir los productos a la lista por primera vez------------------//

function anadirFlor(e){
    e.preventDefault(); 
    const id = e.dataTransfer.getData("idFlor");
    if (!id) return;
    const flor = listaProductos.find(p => p.id == id);
    if (!flor) return;
    if (ramo.agregarFlor(flor)) { 
        actualizarRamoUI(); 
    } 

}

//---------------filtrado de los productos, solo los utilizables en el ramo------------//

function comenzarRamo(){
    modoRamo = true;
    resetearPagina();
    btn.style.display = "none"
    formu.style.display = "none"
    const flores = listaProductos.filter(p => p instanceof Flor);
    renderizarTienda(flores);
    contenedorR.style.display = "block";
}
//--------------------borra todo bestigio de la generacion del ramo--------------------//

function restaurar(){
    modoRamo = false;
    contenedorR.style.display = "none";
    btn.style.display = "block"
    formu.style.display = "block"
    renderizarTienda(listaProductos);
    ramo.restaurar();
    actualizarRamoUI();
}



//------------------------funcion dela actualizacion del ramo-------------------------//

function actualizarRamoUI() {
    ramoPers.innerHTML = "";
    ramo.flores.forEach(item => {
        const card = document.createElement("div");
        card.className = "card p-2 mb-2 shadow-sm";
        card.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <img src="${item.flor.imagen}" 
                    style="width:40px;height:40px;object-fit:cover;border-radius:6px">
                <div class="flex-grow-1 d-flex flex-column">
                    <strong>${item.flor.nombre}</strong>
                    <input type="number" min="0" value="${item.cantidad}" class="cantidadRamo" data-id="${item.flor.id}">
                </div>
                <div class="btn-group">
                    <button class="btn btn-sm btn-danger eliminar" data-id="${item.flor.id}">x</button>
                </div>
            </div>
            `;
        ramoPers.appendChild(card);
    });
    contadorFlores.textContent = ramo.totalFlores();
    contadorPrecio.textContent = ramo.precio().toFixed(2) + "€";
}


//---------------listeners del regulador de cantidad y el de borrar------------//

ramoPers.addEventListener("change", (e) => {
    if (!e.target.classList.contains("cantidadRamo")) return;

    const idFlor = e.target.dataset.id;
    const nuevoValor = parseInt(e.target.value);
    if (nuevoValor <= 0) {
        ramo.eliminarFlor(idFlor);
    } else {
        ramo.setCantidad(idFlor, nuevoValor);
    }
    actualizarRamoUI();
});

ramoPers.addEventListener("click", (e) => {
    if (!e.target.classList.contains("eliminar")) return;
    ramo.eliminarFlor(e.target.dataset.id);
    actualizarRamoUI();
});

//----------------------------añade el ramo al carrito-------------------------//

function añadirCarrito() { 
    if (ramo.totalFlores() != 0) { 
        const idRamo = "ramo_" + Date.now(); 
        carrito[idRamo] = { 
            nombre: "Ramo Personalizado", 
            precio: ramo.precio(), 
            imagen: "imagenes/RamoPersonalizado.png", 
            cantidad: 1, 
        }; 
        restaurar(); 
        actualizarCarrito(); 
    } 
}

