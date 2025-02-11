import React, { useState, useEffect } from 'react';
import './styles/CrearProductoForm.css';
import { createProduct } from '../../../../services/productServices';
import { getCategoriesByUser } from '../../../../services/categoryServices'; // Asegúrate de tener esta importación

function CrearProductoForm({ isVisible, onClose }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidadDisponible, setCantidadDisponible] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [imagenes, setImagenes] = useState(null); // Cambiado a un archivo
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [categorias, setCategorias] = useState([]); // Estado para almacenar las categorías
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const categoriasData = await getCategoriesByUser(token); // Llamada a la API
        setCategorias(categoriasData); // Almacenar las categorías
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    fetchCategories();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  if (!isVisible) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('cantidadDisponible', cantidadDisponible);
      formData.append('precioCompra', precioCompra);
      formData.append('precioVenta', precioVenta);
      formData.append('nombreCategoria', nombreCategoria);

      // Si se seleccionaron imágenes, agregar al FormData
      if (imagenes) {
        for (let i = 0; i < imagenes.length; i++) {
          formData.append('imagenes', imagenes[i]);
        }
      }

      const respuesta = await createProduct(formData, token);
      setMensaje(respuesta.mensaje || 'Producto creado exitosamente');
      setNombre('');
      setDescripcion('');
      setCantidadDisponible('');
      setPrecioCompra('');
      setPrecioVenta('');
      setImagenes(null); // Limpiar las imágenes
      setNombreCategoria('');
      onClose(); // Cierra el popup
      window.location.reload(); // Recarga la página
    } catch (error) {
      console.error('Error al crear el producto:', error);
      setMensaje('Error al crear el producto.');
    }
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    setImagenes(files); // Almacenar los archivos seleccionados
  };

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Crear Nuevo Producto</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="productoNombre">Nombre del Producto</label>
            <input
              type="text"
              id="productoNombre"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="productoDescripcion">Descripción</label>
            <textarea
              id="productoDescripcion"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="productoCantidad">Cantidad Disponible</label>
            <input
              type="number"
              id="productoCantidad"
              placeholder="Cantidad"
              value={cantidadDisponible}
              onChange={(e) => setCantidadDisponible(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="productoPrecioCompra">Precio de Compra</label>
            <input
              type="number"
              id="productoPrecioCompra"
              placeholder="Precio de Compra"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="productoPrecioVenta">Precio de Venta</label>
            <input
              type="number"
              id="productoPrecioVenta"
              placeholder="Precio de Venta"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(e.target.value)}
            />
          </div>
          {/* Cuadro de selección para las categorías */}
          <div className="form-group">
            <label htmlFor="productoCategoria">Seleccionar Categoría</label>
            <select
              id="productoCategoria"
              value={nombreCategoria}
              onChange={(e) => setNombreCategoria(e.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria._id} value={categoria.nombre}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
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

export default CrearProductoForm;
