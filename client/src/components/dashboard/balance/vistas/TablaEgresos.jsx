import React, { useEffect, useState } from "react";
import "../vistas/styles/TablaVentas.css";
import { getEgresos } from "../../../../services/egresoService";

const TablaEgresos = () => {
  const [egresos, setEgresos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 15;

  useEffect(() => {
    const fetchEgresos = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getEgresos(token);
        setEgresos(data);
      } catch (error) {
        console.error("Error al obtener los egresos:", error.mensaje);
      }
    };

    fetchEgresos();
  }, []);

  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = indiceInicial + registrosPorPagina;
  const egresosPaginados = egresos.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(egresos.length / registrosPorPagina);

  return (
    <div className="tabla-container">
      <h3>Egresos</h3>
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto Comprado</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {egresosPaginados.length > 0 ? (
            egresosPaginados.map((egreso) => (
              <tr key={egreso.id}>
                <td>{new Date(egreso.createdAt).toLocaleDateString()}</td>
                <td>{egreso.productoNombre}</td>
                <td>{egreso.descripcion}</td>
                <td>{egreso.cantidad}</td>
                <td>
                  {`$ ${Number(egreso.total).toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                </td>
                <td>
                  <button className="editar-venta"></button>
                  <button className="eliminar-venta"></button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay egresos registrados</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="paginacion">
        <button
          onClick={() => setPaginaActual(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          Anterior
        </button>
        <span>{`Página ${paginaActual} de ${totalPaginas}`}</span>
        <button
          onClick={() => setPaginaActual(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TablaEgresos;