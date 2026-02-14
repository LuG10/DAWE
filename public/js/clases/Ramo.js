import { Producto } from '../Producto.js';

export class Ramo extends Producto {
    // Atributo extra específico de Ramo (Requisito 4.1.2)
    // Ejemplo: 'tipo' para saber si es flor natural, seca,corona funeraria, etc.
    #tipoRamo; 

    constructor(nombre, precio, descripcion, imagen, tipoRamo) {
        // Llamamos al constructor del padre (Producto)
        // Equivalente a Producto.apply(this...) del código antiguo
        super(nombre, precio, descripcion, imagen);
        
        this.#tipoRamo = tipoRamo;
    }

}