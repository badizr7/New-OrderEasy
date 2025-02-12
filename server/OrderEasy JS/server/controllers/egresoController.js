const Egreso = require("../models/egresoModel");
const Producto = require("../models/productModel");

// 📌 Registrar un egreso (compra de productos)
const createEgreso = async (req, res) => {
  try {
    const { productoNombre, cantidad, descripcion } = req.body;
    const usuarioId = req.usuario.id; // Usuario autenticado

    // Buscar el producto por nombre y usuarioId
    const producto = await Producto.findOne({ nombre: productoNombre, usuarioId });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Calcular el total del egreso
    const total = cantidad * producto.precioCompra;

    // Crear el egreso
    const nuevoEgreso = new Egreso({
      productoNombre,
      cantidad,
      precioCompra: producto.precioCompra,
      total,
      descripcion,
      usuarioId,
    });

    await nuevoEgreso.save();

    // Aumentar el stock del producto
    producto.cantidadDisponible += cantidad;
    await producto.save();

    res.status(201).json(nuevoEgreso);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar el egreso", error: error.message });
  }
};

// 📌 Obtener todos los egresos de un usuario
const getEgresos = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const egresos = await Egreso.find({ usuarioId }).sort({ createdAt: -1 });

    res.json(egresos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los egresos", error: error.message });
  }
};

module.exports = { createEgreso, getEgresos };
