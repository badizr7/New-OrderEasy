import React, { useEffect, useState } from "react";
import "../vistas/styles/TablaVentas.css";
import { getVentas } from "../../../../services/ventaService";

const TablaIngresos = () => {
  const [ventas, setVentas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 15;

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getVentas(token);
        setVentas(data);
      } catch (error) {
        console.error("Error al obtener las ventas:", error.mensaje);
      }
    };

    fetchVentas();
  }, []);

  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = indiceInicial + registrosPorPagina;
  const ventasPaginadas = ventas.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(ventas.length / registrosPorPagina);

  return (
    <div className="tabla-container">
      <h3>Ingresos</h3>
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto Vendido</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventasPaginadas.length > 0 ? (
            ventasPaginadas.map((venta) => (
              <tr key={venta.id}>
                <td>{new Date(venta.createdAt).toLocaleDateString()}</td>
                <td>{venta.productoNombre}</td>
                <td>{venta.descripcion}</td>
                <td>{venta.cantidad}</td>
                <td>
                  {`$ ${Number(venta.total).toLocaleString('es-CO', {
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
              <td colSpan="6">No hay ventas registradas</td>
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

export default TablaIngresos;
