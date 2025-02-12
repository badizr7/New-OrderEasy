import React, { useState } from "react";
import RegistrarIngresoForm from "./vistas/RegistrarIngresoForm";
import RegistrarEgresoForm from "./vistas/RegistrarEgresoForm";
import "./balance.css";

function Balance() {
  const [mostrarIngreso, setMostrarIngreso] = useState(false);
  const [mostrarEgreso, setMostrarEgreso] = useState(false);

  return (
    <div>
      {/* Botones para abrir los formularios */}
      <div className="botones">
        <button className="nuevo-ingreso" onClick={() => setMostrarIngreso(true)}>
          Registrar Venta
        </button>
        <button className="nuevo-egreso" onClick={() => setMostrarEgreso(true)}>
          Registrar Egreso
        </button>
      </div>

      {/* Balance distribuido horizontalmente */}
      <div className="balance">
        <div className="balance-general">
          <h3>Balance General</h3>
        </div>
        <div className="ingresos">
          <h3>Ingresos Totales</h3>
        </div>
        <div className="egresos">
          <h3>Egresos Totales</h3>
        </div>
      </div>

      {/* Botones inferiores */}
      <div className="botones-expandibles">
        <button className="btn-ingresos">Ingresos</button>
        <button className="btn-egresos">Egresos</button>
      </div>

      {/* Formularios flotantes */}
      {mostrarIngreso && <RegistrarIngresoForm cerrarFormulario={() => setMostrarIngreso(false)} />}
      {mostrarEgreso && <RegistrarEgresoForm cerrarFormulario={() => setMostrarEgreso(false)} />}
    </div>
  );
}

export default Balance;
