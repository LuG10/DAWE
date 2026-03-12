function Cabecera({ titulo }) {
  // Incluirá el elemento <header> de la primera iteración
  return (
    <header>
      <h1 className="text-center fw-bold">{titulo}</h1>
    </header>
  );
}

export default Cabecera;