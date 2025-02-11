const Producto = require('../models/productModel');
const Categoria = require('../models/categoryModel');

// Crear un producto
const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, cantidadDisponible, precioCompra, precioVenta, nombreCategoria } = req.body;
    const usuarioId = req.usuario.id;
    
    // Obtener las rutas de las imágenes subidas
    const imagenes = req.files ? req.files.map(file => file.path) : []; // Obtener las rutas de las imágenes subidas

    // Verificar si la categoría existe y pertenece al usuario, utilizando el nombre
    const categoria = await Categoria.findOne({ nombre: nombreCategoria, usuarioId });
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada o no pertenece al usuario.' });
    }

    // Crear el producto
    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      cantidadDisponible,
      precioCompra,
      precioVenta,
      imagenes, // Guardar las rutas de las imágenes en el campo imagenes
      categoriaNombre: categoria.nombre,
      categoriaId: categoria._id, // Asociamos el id de la categoría al producto
      usuarioId,
    });

    await nuevoProducto.save();
    res.status(201).json({ mensaje: 'Producto creado exitosamente.', producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el producto.', error });
  }
};


// Obtener todos los productos de un usuario
const getAllProducts = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const productos = await Producto.find({ usuarioId }).populate('categoriaId', 'nombre');
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los productos.', error });
  }
};

// Obtener un producto por su ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const producto = await Producto.findOne({ _id: id, usuarioId }).populate('categoriaId', 'nombre');
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado o no pertenece al usuario.' });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el producto.', error });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, cantidadDisponible, precioCompra, precioVenta, categoriaId, imagenes } = req.body;
    const usuarioId = req.usuario.id;

    // Verificar si el producto existe y pertenece al usuario
    const producto = await Producto.findOne({ _id: id, usuarioId });
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado o no pertenece al usuario.' });
    }

    // Si se proporciona una nueva categoría, verificar que exista y sea del usuario
    if (categoriaId) {
      const categoria = await Categoria.findOne({ _id: categoriaId, usuarioId });
      if (!categoria) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada o no pertenece al usuario.' });
      }
      producto.categoriaId = categoriaId;
    }

    // Actualizar los campos del producto
    producto.nombre = nombre || producto.nombre;
    producto.descripcion = descripcion || producto.descripcion;
    producto.cantidadDisponible = cantidadDisponible || producto.cantidadDisponible;
    producto.precioCompra = precioCompra || producto.precioCompra;
    producto.precioVenta = precioVenta || producto.precioVenta;
    producto.imagenes = imagenes || producto.imagenes;

    await producto.save();
    res.status(200).json({ mensaje: 'Producto actualizado exitosamente.', producto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el producto.', error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Obtienes el ID del producto
    const usuarioId = req.usuario.id; // ID del usuario autenticado

    // Verifica si el producto existe y pertenece al usuario
    const producto = await Producto.findOneAndDelete({ _id: id, usuarioId });

    // Si el producto fue encontrado y eliminado, se responde con un mensaje de éxito
    res.status(200).json({ mensaje: 'Producto eliminado exitosamente.' });
  } catch (error) {
    // En caso de error, enviamos un mensaje con el error
    console.error(error); // Es recomendable imprimir el error en los logs para depuración
    res.status(500).json({ mensaje: 'Error al eliminar el producto.', error: error.message });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
