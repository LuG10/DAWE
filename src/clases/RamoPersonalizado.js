import { Producto } from '../Producto.js';

export class RamoPersonalizado extends Producto{ 

    #flores; 
    #maxFlores; 

    constructor() { 
        super("Ramo Personalizado", "0", "ramo diseñdo al gusto del comprador", "imagenes/RamoPersonalizado.png");
        this.#flores = []; 
        this.#maxFlores = 20; 
    } 
    
    agregarFlor(flor) { 
        if (!flor) return false;
        const existente = this.#flores.find(f => f.flor.id === flor.id);
        if (this.totalFlores() + 1 > this.#maxFlores) return false;
        if (existente) {
            return true
        } else {
            this.#flores.push({ flor, cantidad: 1 });
        }
        return true; 
    }

    eliminarFlor(id) { 
        this.#flores = this.#flores.filter(f => f.flor.id !== id); 
    } 
    
    totalFlores() { 
        return this.#flores.reduce((acc, f) => acc + f.cantidad, 0); 
    } 

    setCantidad(idFlor, nuevoValor){
        const item = this.#flores.find(f => f.flor.id == idFlor);
        if (!item) return;
        const cantidad = Number(nuevoValor);
        if (cantidad <= 0) {
            this.eliminarFlor(id);
            return;
        }
        const resto = this.totalFlores() - item.cantidad;
        item.cantidad = Math.min(cantidad, this.#maxFlores - resto);
    }

    restaurar(){
        this.#flores = [];
    }

    precio() {
    return Math.round(
        this.#flores.reduce((total, item) =>
            total + (item.flor.precio * 1.10 * item.cantidad), 0
        ) * 100
    ) / 100;
}

    get flores() { return this.#flores; }

}