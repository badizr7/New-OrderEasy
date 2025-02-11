// controllers/categoryController.js
const Categoria = require('../models/categoryModel');

// Crear una nueva categoría
const createCategory = async (req, res) => {
  try {
    // Verificar que req.usuario contiene la información del usuario
    // console.log('Usuario autenticado:', req.usuario);  // Ahora deberías ver el id aquí
    
    const { nombre, descripcion } = req.body;

    // Accede a todos los datos del usuario desde req.usuario
    const { id: usuarioId } = req.usuario;

    // Verificar que el usuario tenga la información necesaria
    if (!usuarioId) {
      return res.status(400).json({ mensaje: 'Usuario no autenticado.' });
    }

    // Verificar si ya existe una categoría con el mismo nombre para este usuario
    const categoriaExistente = await Categoria.findOne({ nombre, usuarioId });
    if (categoriaExistente) {
      return res.status(400).json({ mensaje: 'Ya existe una categoría con este nombre.' });
    }

    // Crear la nueva categoría
    const nuevaCategoria = new Categoria({
      nombre,
      descripcion,
      usuarioId,  // Asociamos el usuarioId a la categoría
    });

    // Guardar la categoría en la base de datos
    await nuevaCategoria.save();
    res.status(201).json({ mensaje: 'Categoría creada exitosamente.', categoria: nuevaCategoria });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la categoría.', error });
  }
};
  
  

// Obtener las categorías de un usuario
const getCategoriesByUser = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // Obtenemos el id del usuario desde el token JWT

    // Buscar las categorías del usuario
    const categorias = await Categoria.find({ usuarioId });
    res.status(200).json({ categorias });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las categorías.', error });
  }
};

// Editar una categoría
const updateCategory = async (req, res) => {
    try {
      const { id } = req.params; // id de la categoría a actualizar
      const { nombre, descripcion } = req.body;
      const usuarioId = req.usuario.id;
  
      // Verificar si la categoría existe y si el usuario es el propietario
      const categoria = await Categoria.findOne({ _id: id, usuarioId });
      if (!categoria) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada o no pertenece al usuario.' });
      }
  
      // Actualizar la categoría
      categoria.nombre = nombre || categoria.nombre;
      categoria.descripcion = descripcion || categoria.descripcion;
  
      await categoria.save();
      res.status(200).json({ mensaje: 'Categoría actualizada exitosamente.', categoria });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar la categoría.', error });
    }
  };

// Eliminar una categoría
const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params; // id de la categoría a eliminar
      const usuarioId = req.usuario.id;
  
      // Verificar si la categoría existe y si el usuario es el propietario
      const categoria = await Categoria.findOneAndDelete({ _id: id, usuarioId });
      if (!categoria) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada o no pertenece al usuario.' });
      }
  
      res.status(200).json({ mensaje: 'Categoría eliminada exitosamente.' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar la categoría.', error });
    }
  };
  


module.exports = { createCategory, getCategoriesByUser, updateCategory , deleteCategory };
