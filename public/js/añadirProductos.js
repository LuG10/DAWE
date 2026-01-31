const form = document.getElementById("FormularioProd");
const tablaBody = document.querySelector("#tablaProductos tbody");

let filaActual = null;
let columnas = 0;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const categoria = document.getElementById("categoria").value;
  const NombreProducto = document.getElementById("NombreProducto").value;
  const precio = document.getElementById("precioProducto").value;
  const descripcion = document.getElementById("descripcion").value;
  const formData = new FormData();
  formData.append("archivo", archivoArrastrado);


  if (categoria=="" || NombreProducto=="" || precio=="" || descripcion==""){
    return;
  }

  /*let foto = '';
  if (archivoArrastrado) {
    const url = URL.createObjectURL(archivoArrastrado);
    foto = `<img src="${url}" width="100" height="120">`;
  }else {
    foto = `<img src="imagenes/sinfoto.png" width="100" height="120">`;
  }*/


  const td = document.createElement("td");
  td.innerHTML = `
    <img src="imagenes/sinfoto.png" width="100" height="120">
    <h3>${NombreProducto}</h3>
    <div>${precio}€</div>
    <div>${categoria}</div>
    <div>${descripcion}</div>
  `;

  if (columnas === 0) {
    filaActual = document.createElement("tr");
    tablaBody.appendChild(filaActual);
  }

  filaActual.appendChild(td);
  columnas++;

  if (columnas == 3) {
    columnas = 0;
  }

  form.reset();
});