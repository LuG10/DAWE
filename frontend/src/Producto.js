export class Producto {
  #id;
  #nombre;
  #precio;
  #descripcion;
  #imagen;
  #categoria;

  constructor(nombre, precio, descripcion, imagen, categoria) {
    this.#nombre = nombre;
    this.#precio = precio;
    this.#descripcion = descripcion;
    this.#imagen = imagen;
    this.#id = this.#generarId(nombre);
    this.#categoria = categoria;
  }

  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get precio() { return this.#precio; }
  get descripcion() { return this.#descripcion; }
  get imagen() { return this.#imagen; }
  get categoria() { return this.#categoria; }

  set nombre(v) { this.#nombre = v; }
  set precio(v) { this.#precio = v; }
  set descripcion(v) { this.#descripcion = v; }
  set imagen(v) { this.#imagen = v; }
  set categoria(v) { this.#categoria = v; }

  #generarId(nombre) {
  // Ahora el ID será siempre igual para el mismo nombre (ej: "ramo-de-rosas")
  return nombre.toLowerCase().trim().replace(/\s+/g, '-');
}

  toPlainObject() {
    return {
      id: this.#id,
      nombre: this.#nombre,
      precio: this.#precio,
      descripcion: this.#descripcion,
      imagen: this.#imagen,
      categoria: this.#categoria
    };
  }
}
