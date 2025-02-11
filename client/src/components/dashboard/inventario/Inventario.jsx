import React, { useState, useEffect } from 'react';
import VisualizarProductos from './vistas/VisualizarProductos';
import CrearCategoriaForm from './vistas/CrearCategoriaForm';
import CrearProductoForm from './vistas/CrearProductoForm';
import GestionarCategoriaForm from './vistas/GestionarCategoriaForm';
import { getCategoriesByUser } from '../../../services/categoryServices'; // Ajusta la ruta si es necesario
import { getAllProducts } from '../../../services/productServices'; // Servicio para obtener productos

function Inventario() {
  const [isCrearCategoriaVisible, setCrearCategoriaVisible] = useState(false);
  const [isCrearProductoVisible, setCrearProductoVisible] = useState(false);
  const [isGestionarCategoriaVisible, setGestionarCategoriaVisible] = useState(false);
  const [categorias, setCategorias] = useState([]); // Estado para las categorías
  const [productos, setProductos] = useState([]); // Estado para los productos
  const [selectedCategoria, setSelectedCategoria] = useState(''); // Categoría seleccionada

  // Obtener categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token'); // Suponiendo que el token está almacenado aquí
        const categoriasData = await getCategoriesByUser(token);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  // Obtener productos al montar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem('token'); // Suponiendo que el token está almacenado aquí
        if (token) {
          const productosData = await getAllProducts(token);
          setProductos(productosData); // Almacenar los productos
        } else {
          console.error('No se encontró el token.');
        }
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const handleAgregarCategoria = () => {
    setCrearCategoriaVisible(true);
  };

  const handleCerrarCategoriaPopup = () => {
    setCrearCategoriaVisible(false);
  };

  const handleAgregarProducto = () => {
    setCrearProductoVisible(true);
  };

  const handleCerrarProductoPopup = () => {
    setCrearProductoVisible(false);
  };

  const handleGestionarCategorias = () => {
    setGestionarCategoriaVisible(true);
  };

  const handleCerrarGestionarCategoriaPopup = () => {
    setGestionarCategoriaVisible(false);
  };

  const handleCategoriaChange = (event) => {
    setSelectedCategoria(event.target.value);
  };

  return (
    <div>
      {/* Controles principales */}
      <div>
        <button onClick={handleAgregarProducto}>Agregar Producto</button>
        <button onClick={handleGestionarCategorias}>Gestionar Categorías</button>
      </div>

      {/* Controles de categorías */}
      <div>
        <button onClick={handleAgregarCategoria}>Agregar Categoría</button>
        <select name="categorias" value={selectedCategoria} onChange={handleCategoriaChange}>
          <option value="">Seleccione una categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria._id} value={categoria._id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        <input type="text" placeholder="Buscar Producto" />
      </div>

      {/* Formularios de creación y gestión */}
      <CrearCategoriaForm
        isVisible={isCrearCategoriaVisible}
        onClose={handleCerrarCategoriaPopup}
      />
      <CrearProductoForm
        isVisible={isCrearProductoVisible}
        onClose={handleCerrarProductoPopup}
      />
      <GestionarCategoriaForm
        isVisible={isGestionarCategoriaVisible}
        onClose={handleCerrarGestionarCategoriaPopup}
      />

      {/* Renderización de productos */}
      <VisualizarProductos productos={productos} />
    </div>
  );
}

export default Inventario;
