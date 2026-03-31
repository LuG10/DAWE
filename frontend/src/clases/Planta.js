import { Producto } from '../Producto.js';

export class Planta extends Producto {
    #ubicacion; 

    constructor(nombre, precio, descripcion, imagen, ubicacion) {
      
        super(nombre, precio, descripcion, imagen, "Planta");
        
                this.#ubicacion = ubicacion; 
    }

    // Getter y Setter para el atributo extra
    get ubicacion() { return this.#ubicacion; }
    set ubicacion(valor) { this.#ubicacion = valor; }
}