import React from 'react';
import './styles/ProductoInfo.css';
import { deleteProduct } from '../../../../services/productServices'; // Importa la función deleteProduct

function ProductoInfo({ producto, onClose, onEdit, onDelete }) {
  const handleDelete = async () => {
    const token = localStorage.getItem('token'); // Recupera el token del localStorage

    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    // Verifica que el producto tenga el campo _id
    if (!producto._id) {
      console.error('Producto ID no encontrado');
      return;
    }

    try {
      // Elimina solo el producto utilizando _id
      await deleteProduct(producto._id, token);
      onDelete(); // Llama a onDelete para actualizar la UI en el componente principal

      // Recarga la página después de eliminar el producto
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Token inválido o expirado');
      } else {
        console.error('Error al eliminar el producto:', error);
      }
    }
  };

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Detalles del Producto</h2>
        <button className="cerrar" onClick={onClose}>X</button>
        <div className="producto-info">
          <h3 className='tittle'>{producto.nombre}</h3>
          <p><strong>Descripción:</strong> {producto.descripcion}</p>
          <p><strong>Cantidad Disponible:</strong> {producto.cantidadDisponible}</p>
          <p><strong>Precio de Compra:</strong> ${producto.precioCompra}</p>
          <p><strong>Precio de Venta:</strong> ${producto.precioVenta}</p>
        </div>
        <div className="producto-actions">
          <button className="editar-btn" onClick={() => onEdit(producto._id)}>
            Editar
          </button>
          <button className="eliminar-btn" onClick={handleDelete}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoInfo;
