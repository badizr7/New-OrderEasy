const mongoose = require("mongoose");

const egresoSchema = new mongoose.Schema(
  {
    productoNombre: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precioCompra: { type: Number, required: true },
    total: { type: Number, required: true },
    descripcion: { type: String, required: true },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Egreso", egresoSchema);
