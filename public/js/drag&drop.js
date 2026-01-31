let archivo = null;





function dragoverHandler(event) {
    event.preventDefault();
}

function dropHandler(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text"); 
    const elemento = document.getElementById(data);
    event.target.appendChild(elemento); 
}

// Necesario para dragstart del elemento
const dragItem = document.getElementById("drag1");
dragItem.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text", e.target.id);
});
