const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  productoNombre: { type: String, required: true },  // Nombre del producto vendido
  cantidad: { type: Number, required: true },        // Cantidad vendida
  precioVenta: { type: Number, required: true },     // Precio de venta unitario
  total: { type: Number, required: true },           // Total de la venta (precioVenta * cantidad)
  descripcion: { type: String, default: '' },        // Descripción opcional
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }, // Usuario que hizo la venta
}, { timestamps: true });

module.exports = mongoose.model('Venta', ventaSchema);
