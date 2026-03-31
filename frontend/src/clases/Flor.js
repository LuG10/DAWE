import { Producto } from '../Producto.js';

export class Flor extends Producto {
    #color; 

    constructor(nombre, precio, descripcion, imagen, color) {
        // Llamamos al constructor del padre (Producto)
        // Equivalente a Producto.apply(this...) del código antiguo
        super(nombre, precio, descripcion, imagen, "Flor");
        
        this.#color = color;
    }

    // Getter y Setter para el atributo extra
    get color() { return this.#color; }
    set color(valor) { this.#color = valor; }
}