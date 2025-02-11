const mongoose = require('mongoose');

const ingresoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ingreso', ingresoSchema);
