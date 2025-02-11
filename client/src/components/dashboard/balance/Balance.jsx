import React from 'react';
import './Balance.css'; // Asegúrate de importar el CSS

function Balance() {
  return (
    <div>
      {/* Botones a la derecha */}
      <div className="botones">
        <button className='nuevo-ingreso'>Registrar Ingreso</button>
        <button className='nuevo-egreso'>Registrar Egreso</button>
      </div>

      {/* Balance distribuido horizontalmente con margen */}
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

      {/* Botones inferiores ocupando todo el ancho */}
      <div className="botones-expandibles">
        <button className="btn-ingresos">Ingresos</button>
        <button className="btn-egresos">Egresos</button>
      </div>

      {/* Espacio para tablas */}
      <div className="tablas"></div>
    </div>
  );
}

export default Balance;
