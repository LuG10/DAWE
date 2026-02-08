import { crearProducto, listaProductos } from './tienda.js';
import { renderizarTienda, paginaActual, PRODUCTOS_POR_PAGINA } from './main.js';

var fileselect = document.getElementById("fileselect");
var dropbox = document.getElementById("dropbox");
const form = document.getElementById("FormularioProd");

let imagenSeleccionada = null;

dropbox.addEventListener("dragenter", dragOver); 
dropbox.addEventListener("dragexit", dragOver); 
dropbox.addEventListener("dragover", dragOver); 
dropbox.addEventListener("drop", gestorFicheros); 
fileselect.addEventListener("change", gestorFicheros); 

function dragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault(); 
  evt.target.className = (evt.type == "dragover" ? "hover" : ""); 
}

function gestorFicheros(e) {
  dragOver(e);
  var files = e.target.files || e.dataTransfer.files;
  imagenSeleccionada = files[-1].name
  mostrarIconoArchivo();
}

function mostrarIconoArchivo(fle) {
  previewContainer.innerHTML = "";

  const fileBadge = document.createElement("div");
  fileBadge.className = "d-flex align-items-center p-2 border rounded bg-light";
  fileBadge.style.width = "fit-content";

  fileBadge.innerHTML = `
    <span style="font-size: 2rem; margin-right: 10px;">📄</span>
    <div>
      <small class="d-block text-muted">Archivo seleccionado:</small>
      <strong>${imagenSeleccionada}</strong>
    </div>
    <button type="button" class="btn-close ms-3" onclick="resetFile()" aria-label="Close"></button>
  `;

  previewContainer.appendChild(fileBadge);
}



form.addEventListener("submit", function (e) {
  e.preventDefault();
  const tipo = document.getElementById("categoria").value;
  const nombre = document.getElementById("NombreProducto").value;
  const precio = document.getElementById("precioProducto").value;
  const descripcion = document.getElementById("descripcion").value;
  const atributoExtra = document.getElementById("atributoExtra").value;
  const imagen = "imagen/"+ tipo + "/" + imagenSeleccionada;

  if (!tipo || !nombre || !precio || !descripcion || !imagen){
    return;
  }
  
  crearProducto(tipo, nombre, precio, descripcion, imagen, atributoExtra);
  renderizarTienda(listaProductos);
  form.reset();
});