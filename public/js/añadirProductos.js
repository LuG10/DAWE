import { crearProducto, listaProductos } from './tienda.js';
import { renderizarTienda, paginaActual, PRODUCTOS_POR_PAGINA } from './main.js';


var fileselect = document.getElementById("fileselect");
var dropbox = document.getElementById("dropbox");
const form = document.getElementById("FormularioProd");

let archivoSeleccionado = null;

dropbox.addEventListener("dragenter", dragOver); 
dropbox.addEventListener("dragexit", dragOver); 
dropbox.addEventListener("dragover", dragOver); 
dropbox.addEventListener("drop", gestorFicheros); 
fileselect.addEventListener("change", gestorFicheros); 

function dragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault(); 
  if (dropbox.classList.contains("archivo-cargado")) return; 
  dropbox.classList.toggle("hover", evt.type === "dragover");
}


function gestorFicheros(e) {
  dragOver(e);
  var files = e.target.files || e.dataTransfer.files;
  archivoSeleccionado = files[files.length - 1];
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
    <button type="button" class="btn-close ms-3" id="fileDrag" onclick="resetFile()" aria-label="Close" style="z-index: 9999;"></button>
  `;

  dropbox.appendChild(fileBadge);
}



form.addEventListener("submit", function (e) {
  e.preventDefault();
  const tipo = document.getElementById("categoria").value;
  const nombre = document.getElementById("NombreProducto").value;
  const precio = document.getElementById("precioProducto").value;
  const descripcion = document.getElementById("descripcion").value;
  const atributoExtra = document.getElementById("atributoExtra").value;
  const imagen = URL.createObjectURL(archivoSeleccionado);

  if (!tipo || !nombre || !precio || !descripcion || !imagen){
    return;
  }
  
  crearProducto(tipo, nombre, precio, descripcion, imagen, atributoExtra);
  
  izarTienda(listaProductos);
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