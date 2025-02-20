const Producto = require('../models/productModel');
const Categoria = require('../models/categoryModel'); // Asegúrate de importar el modelo de Categoría

// Crear un nuevo producto utilizando el nombre de la categoría en lugar del ID
const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, cantidadDisponible, precioCompra, precioVenta, imagenes, categoriaNombre } = req.body;
    const usuarioId = req.usuario.usuarioId; // Usuario autenticado

    if (!usuarioId) {
      return res.status(400).json({ mensaje: 'Usuario no autenticado.' });
    }

    if (!categoriaNombre) {
      return res.status(400).json({ mensaje: 'El nombre de la categoría es obligatorio.' });
    }

    // Buscar la categoría por su nombre y verificar que pertenece al usuario
    const categoria = await Categoria.findOne({
      where: { nombre: categoriaNombre, usuarioid: usuarioId }
    });

    if (!categoria) {
      return res.status(400).json({ mensaje: 'La categoría no existe o no pertenece al usuario.' });
    }

    // Crear el producto con categoriaid y categoria_nombre
    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      cantidadDisponible,
      precioCompra,
      precioVenta,
      imagenes,
      categoriaNombre,
      categoriaid: categoria.categoriaid, // Usamos el ID obtenido de la categoría
      categoria_nombre: categoriaNombre,  // Guardamos el nombre de la categoría
      usuarioid: usuarioId
    });

    res.status(201).json({
      mensaje: 'Producto creado exitosamente.',
      producto: nuevoProducto
    });
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error al crear el producto.', error: error.message });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const usuarioid = req.usuario.usuarioId;

    const productos = await Producto.findAll({
      where: { usuarioid }
    });

    res.status(200).json(productos); // Devuelve solo el array
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener los productos.', error: error.message });
  }
};


// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.usuarioId;

    const producto = await Producto.findOne({
      where: { productoid: id, usuarioId }
    });

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado o no pertenece al usuario.' });
    }

    res.status(200).json({ producto });
  } catch (error) {
    console.error('❌ Error al obtener producto:', error);
    res.status(500).json({ mensaje: 'Error al obtener el producto.', error: error.message });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, cantidadDisponible, precioCompra, precioVenta, categoriaid } = req.body;
    const usuarioid = req.usuario.usuarioId;

    // Buscar el producto y verificar que pertenece al usuario
    const producto = await Producto.findOne({ where: { productoid: id, usuarioid } });

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado o no pertenece al usuario.' });
    }

    // Actualizar los campos del producto
    await producto.update({
      nombre: nombre || producto.nombre,
      descripcion: descripcion || producto.descripcion,
      cantidadDisponible: cantidadDisponible !== undefined ? cantidadDisponible : producto.cantidadDisponible,
      precioCompra: precioCompra !== undefined ? precioCompra : producto.precioCompra,
      precioVenta: precioVenta !== undefined ? precioVenta : producto.precioVenta,
      categoriaid: categoriaid || producto.categoriaid
    });

    res.status(200).json({ mensaje: 'Producto actualizado exitosamente.', producto });
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el producto.', error: error.message });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioid = req.usuario.usuarioId;

    // Verificar que el producto existe y pertenece al usuario
    const resultado = await Producto.destroy({
      where: { productoid: id, usuarioid }
    });

    if (!resultado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado o no pertenece al usuario.' });
    }

    res.status(200).json({ mensaje: 'Producto eliminado exitosamente.' });
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el producto.', error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};