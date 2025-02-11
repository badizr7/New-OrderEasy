// src/components/Balance.jsx
import React from 'react';

function Balance() {
  return (
    <div>
      <div className="botones">
        <button>Registrar Ingreso</button>
        <button>Registrar Egreso</button>
      </div>

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
        <button>Ingresos</button>
        <button>Egresos</button>
      <div className="tablas">
        
      </div>

    </div>
  );
}

export default Balance;
