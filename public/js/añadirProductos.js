import { crearProducto, listaProductos } from './tienda.js';
import { renderizarTienda, paginaActual, PRODUCTOS_POR_PAGINA } from './main.js';


var fileselect = document.getElementById("fileselect");
var dropbox = document.getElementById("dropbox");
const form = document.getElementById("FormularioProd");

let archivoSeleccionado = null;
let timeoutError = null;

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


  if (!archivoSeleccionado == null){
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