// ======================================================
//IMPORTACIONES
// ======================================================

import { Ramo } from './clases/Ramo.js';
import { Flor } from './clases/Flor.js';
import { Planta } from './clases/Planta.js';
import { Regalo } from './clases/Regalo.js';
import { Accesorio } from './clases/Accesorio.js';
import { Producto } from './Producto.js';

// ======================================================
// ITERACIÓN 2: constantes para la tienda
// ======================================================

export const DIVISA = '€';
export const MAX_COPIAS = 20; 
export const modoRamo = false;
// ======================================================
// LISTA DE PRODUCTOS (Base de datos inicial)
// ======================================================
// Creamos instancias manualmente como pide el PDF (3 de cada tipo mínimo)

export const listaProductos = [
    // ---------------- RAMOS ----------------
    new Ramo("Ramo de Rosas", 35.00, "Nuestro ramo clásico de 12 rosas rojas y blancas frescas es una elección elegante y atemporal que transmite sentimientos profundos con una combinación de colores llena de significado. Las rosas rojas simbolizan el amor, la pasión y la admiración, mientras que las rosas blancas representan pureza, respeto y sinceridad. Juntas crean un contraste armonioso y sofisticado que lo convierte en el detalle perfecto para cualquier ocasión especial.", "imagenes/ramos/ramo rosas.jpg", "Natural"),
    new Ramo("Ramo de Tulipanes", 28.50, "Ramo de 24 tulipanes amarillos.", "imagenes/ramos/ramotulipanes.jpg", "Natural"),
    new Ramo("Centro Floral Seco", 40.00, "Decoración duradera con flores temporada de verano.", "imagenes/ramos/centrofloressecas.jpg", "Seco"),

    // ------------- FLORES INDIVIDUALES -------------
    new Flor("Rosa Violeta Individual", 5.00, "Una rosa de tallo largo.", "imagenes/sinfoto.png", "Rojo"),
    new Flor("Tulipán Blanco", 3.50, "Tulipán fresco de Holanda.", "imagenes/flores/tulipan blanco.jpg", "Blanco"),
    new Flor("Lirio Rosa", 4.00, "Lirio grande y brillante.", "imagenes/flores/lirio rosa.jpg", "Rosa"),

    // ---------------- PLANTAS ----------------
    new Planta("Bonsái Ficus", 55.00, "Bonsái de 5 años, fácil cuidado.", "imagenes/plantas/bonsai.jpg", "Interior"),
    new Planta("Palmera Datilera pequeña", 25.00, "Palmera datilera pequeña para exteriores.", "imagenes/plantas/plantaext.jpg", "Exterior"),
    new Planta("Sansevieria", 8.00, "Sansevieria en maceta blanca.", "imagenes/plantas/plantainterior.png", "Interior"),

    // ---------------- REGALOS ----------------
    new Regalo("Oso de Peluche", 15.00, "Peluche suave de 30cm.", "imagenes/regalos/osoblanco.jpg", "No"),
    new Regalo("Caja de Bombones", 12.00, "Surtido de chocolates belgas.", "imagenes/regalos/cajabombones.jpg", "Si"),
    new Regalo("Botella de Vino", 10.00, "Botella de vino tinto para celebraciones.", "imagenes/regalos/vino.jpg", "Si"),

    // ---------------- ACCESORIOS ----------------
    new Accesorio("Jarrón de Cerámica", 20.00, "Jarrón clásico de cerámica blanca.", "imagenes/accesorios/jarron.png", "Grande"),
    new Accesorio("Maceta", 10.00, "Maceta de cerámica pintada a mano.", "imagenes/accesorios/maceta.jpg", "Pequeño"),
    new Accesorio("Herramientas de Jardinería", 16.50, "Set de herramientas básicas para jardinería.", "imagenes/accesorios/herramientas.jpg", "Pequeño")
];

// ======================================================
// FACTORÍA DE PRODUCTOS 
// ======================================================

export function crearProducto(tipo, nombre, precio, descripcion, imagen, atributoExtra) {
    let nuevoProducto;
    const precioNum = parseFloat(precio);
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

    return nuevoProducto;
}



// ======================================================
//  BUSCADOR DE PRODUCTOS 
// ======================================================

export function buscarProductos(query, productos = listaProductos) {

    const queryLower = query.toLowerCase();

    if (modoRamo) {
        const flores = productos.filter(p => p instanceof Flor || p.categoria === 'Flor');
        return flores.filter(producto =>
            producto.nombre.toLowerCase().includes(queryLower)
        );
    } else {
        return productos.filter(producto =>
            producto.nombre.toLowerCase().includes(queryLower)
        );
    }
}
// ======================================================
// ITERACIÓN 2: funciones localstorage para el carrito
// ======================================================

// Guarda el objeto JS como un string en localStorage usando 'producto_' + ID
// src/tienda.js - Asegúrate de que la función se vea así:
export function guardarEnCarrito(producto) {
    const clave = 'producto_' + producto.id;
    const existente = localStorage.getItem(clave);

    if (existente) {
        const productoGuardado = JSON.parse(existente);
        // Sumamos 1 a la cantidad existente
        productoGuardado.cantidad = (productoGuardado.cantidad || 1) + 1;
        localStorage.setItem(clave, JSON.stringify(productoGuardado));
    } else {
        // Si es nuevo, lo guardamos con cantidad 1
        // Importante: Si 'producto' es una instancia de clase, 
        // usa producto.toPlainObject() o asegúrate de que tenga las propiedades accesibles.
        const datos = typeof producto.toPlainObject === 'function' 
                      ? producto.toPlainObject() 
                      : producto;
        
        localStorage.setItem(clave, JSON.stringify({ ...datos, cantidad: 1 }));
    }
    
    // Opcional: Disparar evento para que el componente Carrito.jsx se entere al instante
    window.dispatchEvent(new Event('carritoActualizado'));
}

// Borra un producto por su ID del localStorage
export function borrarDelCarrito(id) {
    localStorage.removeItem('producto_' + id);
}

// Carga todo el carrito desde localStorage en un array
export function cargarCarrito() {
    let carritoArray = [];
    for (let i = 0; i < localStorage.length; i++) {
        let clave = localStorage.key(i);
        // Filtramos buscando el substring 'producto_'
        if (clave.startsWith('producto_')) {
            let productoStr = localStorage.getItem(clave);
            try {
                let producto = JSON.parse(productoStr);

                // Filtrar productos inválidos o vacíos
                if (producto && typeof producto === "object") {
                    producto.cantidad = producto.cantidad || 1;
                    carritoArray.push(producto);
                } else {
                    // Si está corrupto, lo borramos del localStorage
                    localStorage.removeItem(clave);
                }

            } catch (e) {
                // Si el JSON está roto, lo borramos
                localStorage.removeItem(clave);
            }
        }
    }
    return carritoArray;
}

// ======================================================
// ITERACIÓN 2: funciones localstorage para el fromulario
// ======================================================
