import { Producto } from '../Producto.js';

export class Accesorio extends Producto {
    #tamaño; 

    constructor(nombre, precio, descripcion, imagen, tamaño) {
      
        super(nombre, precio, descripcion, imagen);
        
                this.#tamaño = tamaño; 
    }

    // Getter y Setter para el atributo extra
    get tamaño() { return this.#tamaño; }
    set tamaño(valor) { this.#tamaño = valor; }
}