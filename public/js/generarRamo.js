import { RamoPersonalizado } from './clases/RamoPersonalizado.js';
import { listaProductos } from './tienda.js';
import { renderizarTienda, actualizarCarrito } from './main.js';
import { Flor } from './clases/Flor.js';
import { carrito } from "./tienda.js";

export let modoRamo = false;

const ramo = new RamoPersonalizado();

const ramoPers = document.getElementById("ramoPersonalizado"); 
const contadorFlores = document.getElementById("contadorFlores");
const contadorPrecio = document.getElementById("contadorPrecio");  
const btn = document.getElementById("btnRamoPersonalizado");
const contenedorR = document.getElementById("contenedorRamo");
const form = document.querySelector("#FormularioProd");
const btn_cancel = document.getElementById("btnCancelarRamo");
const btn_carrito = document.getElementById("btnGuardarRamo");

ramoPers.addEventListener("dragover", dragOver); 
ramoPers.addEventListener("drop", anadirFlor); 

btn.addEventListener("click", comenzarRamo);

btn_cancel.addEventListener("click", restaurar);

btn_carrito.addEventListener("click", añadirCarrito)

//------------------listener para qe las flores se consideren arrastrables---------------//

document.addEventListener("dragstart", e => { 
    if (e.target.classList.contains("producto") && modoRamo) { 
        e.dataTransfer.setData("idFlor", e.target.dataset.id); 
    } 
});

function dragOver(evt) {
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
    btn.style.display = "none"
    form.style.display = "none"
    const flores = listaProductos.filter(p => p instanceof Flor);
    renderizarTienda(flores);
    contenedorR.style.display = "block";
}
//--------------------borra todo bestigio de la generacion del ramo--------------------//

function restaurar(){
    modoRamo = false;
    contenedorR.style.display = "none";
    btn.style.display = "block"
    form.style.display = "block"
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