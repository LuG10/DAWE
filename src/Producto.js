export class Producto {
    // Atributos privados 
    #id;
    #nombre;
    #precio;
    #descripcion;
    #imagen;

    constructor(nombre, precio, descripcion, imagen) {
        this.#nombre = nombre;
        this.#precio = precio;
        this.#descripcion = descripcion;
        this.#imagen = imagen;
        // El ID se genera solo y no se puede cambiar (Requisito 4.1.1)
        this.#id = this.#generarId(nombre);
    }

    // --- GETTERS Y SETTERS ---
    // ID solo tiene getter
    get id() { return this.#id; }

    get nombre() { return this.#nombre; }
    set nombre(valor) { this.#nombre = valor; }

    get precio() { return this.#precio; }
    set precio(valor) { this.#precio = valor; }

    get descripcion() { return this.#descripcion; }
    set descripcion(valor) { this.#descripcion = valor; }

    get imagen() { return this.#imagen; }
    set imagen(valor) { this.#imagen = valor; }

    // --- MÉTODOS PRIVADOS ---
    // Función simple para crear un ID único basado en el nombre (hash simulado)
    #generarId(nombre) {
        return nombre.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
    }
}