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
