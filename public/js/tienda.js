// 1. IMPORTACIONES: Traemos las clases que has creado
import { Ramo } from './clases/Ramo.js';
import { Flor } from './clases/Flor.js';
import { Planta } from './clases/Planta.js';
import { Regalo } from './clases/Regalo.js';
import { Accesorio } from './clases/Accesorio.js';

// 2. LISTA DE PRODUCTOS (Base de datos inicial)
// Creamos instancias manualmente como pide el PDF (3 de cada tipo mínimo)
export const listaProductos = [
    // --- RAMOS ---
    new Ramo("Ramo de Rosas", 35.00, "Ramo clásico de 12 rosas rojas y blancas frescas.", "imagenes/ramos/ramo rosas.jpg", "Natural"),
    new Ramo("Ramo de Tulipanes", 28.50, "Ramo de 24 tulipanes amarillos.", "imagenes/ramos/ramotulipanes.jpg", "Natural"),
    new Ramo("Centro Floral Seco", 40.00, "Decoración duradera con flores temporada de verano.", "imagenes/ramos/centrofloressecas.jpg", "Seco"),

    // --- FLORES INDIVIDUALES ---
    new Flor("Rosa Violeta Individual", 5.00, "Una rosa de tallo largo.", "imagenes/sinfoto.png", "Rojo"),
    new Flor("Tulipán Blanco", 3.50, "Tulipán fresco de Holanda.", "imagenes/flores/tulipan blanco.jpg", "Blanco"),
    new Flor("Lirio Rosa", 4.00, "Lirio grande y brillante.", "imagenes/flores/lirio rosa.jpg", "Rosa"),

    // --- PLANTAS ---
    new Planta("Bonsái Ficus", 55.00, "Bonsái de 5 años, fácil cuidado.", "imagenes/plantas/bonsai.jpg", "Interior"),
    new Planta("Palmera Datilera pequeña", 25.00, "Palmera datilera pequeña para exteriores.", "imagenes/plantas/plantaext.jpg", "Exterior"),
    new Planta("Sansevieria", 8.00, "Sansevieria  en maceta blanca.", "imagenes/plantas/plantainterior.png", "Interior"),

    // --- REGALOS ---
    new Regalo("Oso de Peluche", 15.00, "Peluche suave de 30cm.", "imagenes/regalos/osoblanco.jpg", "No"),
    new Regalo("Caja de Bombones", 12.00, "Surtido de chocolates belgas.", "imagenes/regalos/cajabombones.jpg", "Si"),
    new Regalo("Botella de Vino", 10.00, "Botella de vino tinto para celebraciones.", "imagenes/regalos/vino.jpg", "Si"),

    // --- ACCESORIOS ---
    new Accesorio("Jarrón de Cerámica", 20.00, "Jarrón clásico de cerámica blanca.", "imagenes/accesorios/jarron.png", "Grande"),
    new Accesorio("Maceta", 10.00, "Maceta de cerámica pintada a mano.", "imagenes/accesorios/maceta.jpg", "Pequeño"),
    new Accesorio("Herramientas de Jardinería", 16.50, "Set de herramientas básicas para jardinería.", "imagenes/accesorios/herramientas.jpg", "Pequeño"),
];

// 3. CARRITO (Inicialmente vacío)
export const carrito = {}; 
/**
 * Función que necesitas importar en main.js
 * Añade un producto al carrito o incrementa su cantidad.
 */
export function anadirAlCarrito(idProducto) {
    // Buscamos el objeto producto real en la lista
    const producto = listaProductos.find(p => p.id === idProducto);
    
    if (!producto) {
        console.error("Producto no encontrado con ID:", idProducto);
        return;
    }

    if (carrito[idProducto]) {
        // ...incrementamos solo si no llegamos al límite de 20
        if (carrito[idProducto].cantidad < 20) {
            carrito[idProducto].cantidad++;
        } else {
            alert("No puedes añadir más de 20 copias de este producto.");
        }
    } else {
        // Si no existe, lo creamos (cantidad inicial = 1)
        carrito[idProducto] = {
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        };
    }
    
    // Opcional: Para depurar y ver que funciona
    console.log("Estado del carrito:", carrito);
}

export function eliminarDelCarrito(idProducto) {
    if (carrito[idProducto]) {
        delete carrito[idProducto];
    }
}

//método para actualizar la cantidad de un producto en el carrito  rollo cuando cambias con las flechas
export function actualizarCantidadCarrito(idProducto, nuevaCantidad) {
    if (carrito[idProducto]) {
        if (nuevaCantidad <= 20) {
            carrito[idProducto].cantidad = nuevaCantidad;
        } 
        else if (nuevaCantidad === 0) {
            /////ELIMINAR DEL CARRITO SI LA CANTIDAD ES 0
        }
        else {
            alert("Como máximo puedes tener 20 unidades de un mismo producto.");
        }
    } else {
        console.error("El producto no está en el carrito:", idProducto);
    }
}
/**
 * 4. FACTORÍA DE PRODUCTOS (Requisito 5.3)
 * Convierte los datos del formulario en un objeto real de la clase correspondiente.
 */
export function crearProducto(tipo, nombre, precio, descripcion, imagen, atributoExtra) {
    let nuevoProducto;
    const precioNum = parseFloat(precio);

    // switch para elegir qué clase instanciar según el <select> del formulario
    switch (tipo) {
        case 'Ramo':
            nuevoProducto = new Ramo(nombre, precioNum, descripcion, imagen, atributoExtra);
            break;
        case 'Flor':
            nuevoProducto = new Flor(nombre, precioNum, descripcion, imagen, atributoExtra);
            break;
        case 'Planta':
            nuevoProducto = new Planta(nombre, precioNum, descripcion, imagen, atributoExtra);
            break;
        case 'Regalo':
            nuevoProducto = new Regalo(nombre, precioNum, descripcion, imagen, atributoExtra);
            break;
        case 'Accesorio':
            nuevoProducto = new Accesorio(nombre, precioNum, descripcion, imagen, atributoExtra);
            break;
        default:
            console.error("Tipo desconocido");
            return null;
    }

    // Añadimos a la tienda y devolvemos el objeto
    listaProductos.push(nuevoProducto);
    return nuevoProducto;
}
// 5. Buscar productos por nombre (Requisito 5.4)
export function buscarProductos(query) {
    const queryLower = query.toLowerCase();
    return listaProductos.filter(producto => producto.nombre.toLowerCase().includes(queryLower));
}
