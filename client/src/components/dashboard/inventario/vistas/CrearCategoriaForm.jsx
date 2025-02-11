import React, { useState } from 'react';
import './styles/CrearCategoriaForm.css';
import { createCategory } from '../../../../services/categoryServices'; // Importa el servicio

function CrearCategoriaForm({ isVisible, onClose }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');

  if (!isVisible) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Suponiendo que el token se almacena en localStorage
      const nuevaCategoria = { nombre, descripcion };

      const respuesta = await createCategory(nuevaCategoria, token);
      setMensaje(respuesta.mensaje || 'Categoría creada exitosamente');
      setNombre('');
      setDescripcion('');
      onClose(); // Cierra el popup después de crear la categoría
      window.location.reload(); // Recarga la página
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      setMensaje('Error al crear la categoría.');
    }
  };

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Crear Nueva Categoría</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="categoriaNombre">Nombre de la Categoría</label>
            <input
              type="text"
              id="categoriaNombre"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="categoriaDescripcion">Descripción de la Categoría</label>
            <input
              type="text"
              id="categoriaDescripcion"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          <div className="form-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
          {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
      </div>
    </div>
  );
}

export default CrearCategoriaForm;
