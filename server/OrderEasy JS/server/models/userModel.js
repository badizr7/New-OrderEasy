const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  primerNombre: { type: String, required: true },
  segundoNombre: { type: String, required: false },
  primerApellido: { type: String, required: true },
  segundoApellido: { type: String, required: false },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  contraseña: { type: String, required: true },
});

module.exports = mongoose.model('Usuario', userSchema);
