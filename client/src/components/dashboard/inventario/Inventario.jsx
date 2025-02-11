import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import VisualizarProductos from './vistas/VisualizarProductos';
import CrearCategoriaForm from './vistas/CrearCategoriaForm';
import CrearProductoForm from './vistas/CrearProductoForm';
import GestionarCategoriaForm from './vistas/GestionarCategoriaForm';
import { getCategoriesByUser } from '../../../services/categoryServices';
import { getAllProducts } from '../../../services/productServices';

function Inventario() {
  const [isCrearCategoriaVisible, setCrearCategoriaVisible] = useState(false);
  const [isCrearProductoVisible, setCrearProductoVisible] = useState(false);
  const [isGestionarCategoriaVisible, setGestionarCategoriaVisible] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Obtener categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token');
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
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const productosData = await getAllProducts(token);
        setProductos(productosData);
      } else {
        console.error('No se encontró el token.');
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  // Filtrar productos por categoría seleccionada y término de búsqueda
  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria = selectedCategoria
      ? producto.categoriaNombre === selectedCategoria
      : true;

    const coincideNombre = searchTerm
      ? producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return coincideCategoria && coincideNombre;
  });

  // Función para actualizar un producto en la lista
  const handleUpdateProduct = async (updatedProduct) => {
    try {
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto._id === updatedProduct._id ? updatedProduct : producto
        )
      );
      await Swal.fire({
        icon: 'success',
        title: '¡Producto actualizado!',
        text: 'El producto se ha actualizado correctamente.',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el producto.',
      });
    }
  };

  // Función para eliminar un producto
  const handleDeleteProduct = async (deletedProductId) => {
    try {
      setProductos((prevProductos) =>
        prevProductos.filter((producto) => producto._id !== deletedProductId)
      );
      await Swal.fire({
        icon: 'success',
        title: '¡Producto eliminado!',
        text: 'El producto se ha eliminado correctamente.',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el producto.',
      });
    }
  };

  // Función para abrir el modal de ProductoInfo
  const handleVerDetalles = (producto) => {
    setProductoSeleccionado(producto);
  };

  // Función para cerrar el modal de ProductoInfo
  const handleCerrarPopup = () => {
    setProductoSeleccionado(null);
  };

  return (
    <div>
      {/* Controles principales */}
      <div>
        <button onClick={() => setCrearProductoVisible(true)}>Agregar Producto</button>
        <button onClick={() => setGestionarCategoriaVisible(true)}>Gestionar Categorías</button>
      </div>

      {/* Controles de categorías y búsqueda */}
      <div>
        <button onClick={() => setCrearCategoriaVisible(true)}>Agregar Categoría</button>
        <select
          name="categorias"
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria._id} value={categoria.nombre}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Buscar Producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Renderización de productos filtrados */}
      <VisualizarProductos
        productos={productosFiltrados}
        onVerDetalles={handleVerDetalles}
      />

      {/* Modal de ProductoInfo */}
      {productoSeleccionado && (
        <ProductoInfo
          producto={productoSeleccionado}
          onClose={handleCerrarPopup}
          onDelete={handleDeleteProduct}
          onUpdate={handleUpdateProduct}
        />
      )}

      {/* Formularios de creación y gestión */}
      <CrearCategoriaForm
        isVisible={isCrearCategoriaVisible}
        onClose={() => setCrearCategoriaVisible(false)}
      />
      <CrearProductoForm
        isVisible={isCrearProductoVisible}
        onClose={() => setCrearProductoVisible(false)}
      />
      <GestionarCategoriaForm
        isVisible={isGestionarCategoriaVisible}
        onClose={() => setGestionarCategoriaVisible(false)}
      />
    </div>
  );
}

export default Inventario;