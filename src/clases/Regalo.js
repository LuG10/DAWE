import { Producto } from '../Producto.js';

export class Regalo extends Producto {
    #comidaBebida; 

    constructor(nombre, precio, descripcion, imagen, comidaBebida) {
      
        super(nombre, precio, descripcion, imagen);
        
                this.#comidaBebida = comidaBebida; 
    }

    // Getter y Setter para el atributo extra
    get comidaBebida() { return this.#comidaBebida; }
    set comidaBebida(valor) { this.#comidaBebida = valor; }
}