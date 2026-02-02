import { crearProducto, listaProductos } from './tienda.js';
import { renderizarTienda, paginaActual, PRODUCTOS_POR_PAGINA } from './main.js';


const form = document.getElementById("FormularioProd");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const tipo = document.getElementById("categoria").value;
  const nombre = document.getElementById("NombreProducto").value;
  const precio = document.getElementById("precioProducto").value;
  const descripcion = document.getElementById("descripcion").value;
  const atributoExtra = document.getElementById("atributoExtra").value;




  if (tipo=="" || nombre=="" || precio=="" || descripcion=="" ){
    return;
  }
  const imagen = "imagenes/regalos/cajabombones.jpg"
  crearProducto(tipo, nombre, precio, descripcion, imagen, atributoExtra);
  renderizarTienda(listaProductos);
  form.reset();
});