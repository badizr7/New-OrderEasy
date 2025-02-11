import React, { useState, useEffect } from 'react';
import './styles/GestionarCategoriaForm.css';
import { getCategoriesByUser, updateCategory, deleteCategory } from '../../../../services/categoryServices';

function GestionarCategoriaForm({ isVisible, onClose }) {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar si estamos editando
  const [editedCategoria, setEditedCategoria] = useState({
    nombre: '',
    descripcion: '',
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token'); // Suponiendo que el token se almacena en localStorage
        const categoriasData = await getCategoriesByUser(token);
        setCategorias(categoriasData); // Actualizamos el estado con el array de categorías
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    if (isVisible) {
      fetchCategorias();
    }
  }, [isVisible]);

  const handleSelectChange = (event) => {
    const categoriaId = event.target.value;
    const categoria = categorias.find((cat) => cat._id === categoriaId);
    setCategoriaSeleccionada(categoria);
    setEditedCategoria({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
    });
  };

  const handleEdit = () => {
    setIsEditing(true); // Activamos el modo de edición
  };

  const handleSave = async () => {
    if (categoriaSeleccionada) {
      try {
        const token = localStorage.getItem('token');
        const updatedCategoria = { ...categoriaSeleccionada, ...editedCategoria };
        await updateCategory(categoriaSeleccionada._id, updatedCategoria, token);
        
        // Actualizamos la categoría editada en el estado
        setCategorias(categorias.map((cat) =>
          cat._id === categoriaSeleccionada._id ? updatedCategoria : cat
        ));
        setCategoriaSeleccionada(updatedCategoria);
        setIsEditing(false); // Desactivamos el modo de edición
        window.location.reload(); // Recargamos la página
        alert('Categoría actualizada con éxito');
      } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        alert('Hubo un error al actualizar la categoría');
      }
    }
  };

  const handleDelete = async () => {
    if (categoriaSeleccionada) {
      try {
        const token = localStorage.getItem('token');
        await deleteCategory(categoriaSeleccionada._id, token);
        
        // Eliminamos la categoría del estado
        setCategorias(categorias.filter((cat) => cat._id !== categoriaSeleccionada._id));
        setCategoriaSeleccionada(null);
        setIsEditing(false); // Desactivamos el modo de edición
        window.location.reload(); // Recargamos la página
        alert('Categoría eliminada con éxito');
      } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        alert('Hubo un error al eliminar la categoría');
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedCategoria({
      ...editedCategoria,
      [name]: value,
    });
  };

  if (!isVisible) return null;

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Gestionar Categorías</h2>
        <form>
          <div className="form-group">
            <label htmlFor="selectCategoria">Selecciona una Categoría</label>
            <select
              id="selectCategoria"
              onChange={handleSelectChange}
              value={categoriaSeleccionada ? categoriaSeleccionada._id : ""}
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categorias.map((categoria) => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          {categoriaSeleccionada && (
            <div className="categoria-detalles">
              <div className="detalle">
                <strong>Nombre:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="nombre"
                    value={editedCategoria.nombre}
                    onChange={handleInputChange}
                  />
                ) : (
                  categoriaSeleccionada.nombre
                )}
              </div>
              <div className="detalle">
                <strong>Descripción:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="descripcion"
                    value={editedCategoria.descripcion}
                    onChange={handleInputChange}
                  />
                ) : (
                  categoriaSeleccionada.descripcion
                )}
              </div>
            </div>
          )}

          <div className="form-buttons">
            {isEditing ? (
              <button className="guardar-button" type="button" onClick={handleSave}>
                Guardar
              </button>
            ) : (
              <button className="guardar-button" type="button" onClick={handleEdit}>
                Editar
              </button>
            )}
            <button className="eliminar-button" type="button" onClick={handleDelete}>
              Eliminar
            </button>
            <button type="button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GestionarCategoriaForm;
