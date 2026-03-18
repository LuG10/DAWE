import { useState } from 'react';

function AvisoCupon() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div id="avisoCupon" className="alert alert-success d-flex justify-content-between">
      <span className="cuponInfo">Usando FLORA20 obtienes un 20% de descuento en tu compra !!!</span>
      <span className="cuponCond"> Válido a partir de 150€</span>
      <button className="btn-close" onClick={function() {setVisible(false); }}></button>
    </div>
  );
}
export default AvisoCupon;