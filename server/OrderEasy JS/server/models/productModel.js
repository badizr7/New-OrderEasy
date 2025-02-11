// models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  cantidadDisponible: { type: Number, required: true },
  precioCompra: { type: Number, required: true }, // Precio de compra del producto
  precioVenta: { type: Number, required: true }, // Precio de venta del producto
  imagenes: { type: [String], default: [] }, // Lista de URLs o nombres de imágenes, opcional
  categoriaNombre: { type: String, required: true },
  categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true }, // Relación con la categoría
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }, // Relación con el usuario
}, { timestamps: true });

module.exports = mongoose.model('Producto', productSchema);
