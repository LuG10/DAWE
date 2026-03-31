import { useState, useEffect } from 'react';

function MensajeFlash() {
  const [mensaje, setMensaje] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let temporizador;

    const mostrarMensaje = (evento) => {
      setMensaje(evento.detail); 
      setVisible(true);          

      if (temporizador) clearTimeout(temporizador);

      temporizador = setTimeout(() => {
        setVisible(false);
      }, 3000); 
    };

    window.addEventListener('mostrarMensajeFlash', mostrarMensaje);

    return () => {
      window.removeEventListener('mostrarMensajeFlash', mostrarMensaje);
      if (temporizador) clearTimeout(temporizador);
    };
  }, []);

  return (
    <div className={`mensaje-flash ${visible ? 'visible' : ''}`} style={{ position: 'fixed', zIndex: 9999 }}>
      {mensaje}
    </div>
  );
}

export default MensajeFlash;