const Venta = require('../models/ventaModel');
const Producto = require('../models/productModel');

// 📌 Registrar una venta
const createVenta = async (req, res) => {
  try {
    const { productoNombre, cantidad, descripcion } = req.body;
    const usuarioId = req.usuario.id; // Usuario autenticado

    // Buscar el producto por nombre
    const producto = await Producto.findOne({ nombre: productoNombre, usuarioId });

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Verificar si hay suficiente stock
    if (producto.cantidadDisponible < cantidad) {
      return res.status(400).json({ mensaje: 'Stock insuficiente' });
    }

    // Calcular total de la venta
    const total = cantidad * producto.precioVenta;

    // Crear la venta
    const nuevaVenta = new Venta({
      productoNombre,
      cantidad,
      precioVenta: producto.precioVenta,
      total,
      descripcion,
      usuarioId
    });

    await nuevaVenta.save();

    // Actualizar stock del producto
    producto.cantidadDisponible -= cantidad;
    await producto.save();

    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar la venta', error: error.message });
  }
};

// 📌 Obtener todas las ventas de un usuario
const getVentas = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const ventas = await Venta.find({ usuarioId }).sort({ createdAt: -1 });

    res.json(ventas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las ventas', error: error.message });
  }
};

module.exports = { createVenta, getVentas };
