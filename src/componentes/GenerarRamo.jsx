import { useState, useEffect } from 'react';
import { guardarEnCarrito } from '../tienda.js'; 
import { listaProductos, cargarCatalogo } from '../tienda.js';
import { RamoPersonalizado } from '../clases/RamoPersonalizado.js'

function GenerarRamo({setVerSoloFlores}) {
    
    const [ramo, setRamo] = useState(() => {
        const guardado = localStorage.getItem("ramoPersonalizado");
        const nuevoRamo = new RamoPersonalizado();
        if (guardado) {
            const datos = JSON.parse(guardado);
            const catalogo = [...listaProductos, ...cargarCatalogo()];
            datos.forEach(item => {
                const flor = catalogo.find(p => p.id === item.idFlor);
                if (flor) {
                    nuevoRamo.agregarFlor(flor);
                    nuevoRamo.setCantidad(flor.id, item.cantidad);
                }
            });
        }

        return nuevoRamo;
    });

    const [floresRamo, setFloresRamo] = useState(() => ramo.flores);
    
    const dropFlor = (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("idFlor");
        const flor = [...listaProductos, ...cargarCatalogo()].find(p => p.id == id);
        if (!flor) return;

        if (ramo.agregarFlor(flor)) {
        setFloresRamo([...ramo.flores]);
        }
    };

    const cambiarCantidad = (id, valor) => {
        if (valor <= 0) {
        ramo.eliminarFlor(id);
        } else {
        ramo.setCantidad(id, valor);
        }
        setFloresRamo([...ramo.flores]);
    };

    const eliminarFlor = (id) => {
        ramo.eliminarFlor(id);
        setFloresRamo([...ramo.flores]);
    };

    const anadirCarrito = () => { 
        if (ramo.totalFlores() === 0) return;
        const idRamo = "ramo_" + Date.now(); 
        const productoConCantidad =  { id: idRamo , nombre: "Ramo Personalizado", precio: ramo.precio(), imagen: "imagenes/RamoPersonalizado.png", cantidad: 1, flores: ramo.flores};
        guardarEnCarrito(productoConCantidad);
        window.dispatchEvent(new Event("carritoActualizado"));
    } 
   
    useEffect(() => {
        const datos = ramo.flores.map(item => ({
            idFlor: item.flor.id,
            cantidad: item.cantidad
        }));

        localStorage.setItem("ramoPersonalizado", JSON.stringify(datos));
    }, [floresRamo]);

  return (
    <div  className="mt-4 card shadow-sm p-3" style={{ maxWidth: "600px" }}>
        <h4 className="mb-3">Tu ramo personalizado</h4>
        <div className="d-flex justify-content-between align-items-center mb-2">
            <span>
                <strong>Total flores:</strong> {ramo.totalFlores()}/20
            </span>
            <span>
                <strong>Precio:</strong> {ramo.precio().toFixed(2)}€
            </span>
        </div>

        <div className="border rounded p-3 mb-3 bg-light text-center" style={{minHeight:"180px"}} onDrop={dropFlor} onDragOver={(e) => e.preventDefault()}>
            {floresRamo.length === 0 && (
                <span className="text-muted">Arrastra aquí tus flores</span>
            )}
            {floresRamo.map(item => (
                <div key={`${item.flor.id}-${item.cantidad}`} className="card p-2 mb-2 shadow-sm">
                    <div className="d-flex align-items-center gap-2">
                        <img src={item.flor.imagen} style={{width:"40px",height:"40px",objectFit:"cover"}}/>
                        <div className="flex-grow-1 d-flex flex-column">
                            <strong>{item.flor.nombre}</strong>
                            <input type="number" min="0" value={item.cantidad} onChange={(e)=>cambiarCantidad(item.flor.id,Number(e.target.value))}/>
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-sm btn-danger" onClick={()=>eliminarFlor(item.flor.id)}>x</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-success " onClick={() => setVerSoloFlores(false)}>volver </button>
            <button className="btn btn-outline-secondary" onClick={() => {
                ramo.restaurar();
                setFloresRamo([]);
                localStorage.removeItem("ramoPersonalizado");
            }}>
                Cancelar
            </button>
            <button className="btn btn-primary" onClick={() => anadirCarrito()}>
                Guardar ramo
            </button>
        </div>
        
    </div>
  );
}

export default GenerarRamo;







