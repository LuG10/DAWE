export class Producto {
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
    this.#id = this.#generarId(nombre);
  }

  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get precio() { return this.#precio; }
  get descripcion() { return this.#descripcion; }
  get imagen() { return this.#imagen; }

  set nombre(v) { this.#nombre = v; }
  set precio(v) { this.#precio = v; }
  set descripcion(v) { this.#descripcion = v; }
  set imagen(v) { this.#imagen = v; }

  #generarId(nombre) {
    return nombre.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
  }

  toPlainObject() {
    return {
      id: this.#id,
      nombre: this.#nombre,
      precio: this.#precio,
      descripcion: this.#descripcion,
      imagen: this.#imagen
    };
  }
}
