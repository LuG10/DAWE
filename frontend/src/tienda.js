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

export function buscarProductos(query, productos) {
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
export function guardarEnCarrito(producto) {
    const clave = 'producto_' + producto.id;
    const existente = localStorage.getItem(clave);

    if (existente) {
        const productoGuardado = JSON.parse(existente);
        productoGuardado.cantidad = (productoGuardado.cantidad || 1) + 1;
        localStorage.setItem(clave, JSON.stringify(productoGuardado));
    } else {
        const datos = typeof producto.toPlainObject === 'function' 
                      ? producto.toPlainObject() 
                      : producto;
        
        localStorage.setItem(clave, JSON.stringify({ ...datos, cantidad: 1 }));
    }
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
        if (clave.startsWith('producto_')) {
            let productoStr = localStorage.getItem(clave);
            try {
                let producto = JSON.parse(productoStr);
                if (producto && typeof producto === "object") {
                    producto.cantidad = producto.cantidad || 1;
                    carritoArray.push(producto);
                } else {
                    localStorage.removeItem(clave);
                }
            } catch (e) {
                localStorage.removeItem(clave);
            }
        }
    }
    return carritoArray;
}

// ======================================================
// Obtener solo productos de tipo Flor para generar ramo
// ======================================================
export function obtenerFloresParaRamo(productos) {
    return productos.filter(p => (p instanceof Flor) || p.categoria === 'Flor')
}

