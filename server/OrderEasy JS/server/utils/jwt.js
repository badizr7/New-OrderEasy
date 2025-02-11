const jwt = require('jsonwebtoken');

// Función para generar un token JWT
const generarToken = (usuario) => {
  // El usuario es un objeto que tiene el _id (por defecto en MongoDB)
  return jwt.sign(
    {
      id: usuario._id.toString(),  // Incluir el _id del usuario en el payload del token
      correo: usuario.correo,
      primerNombre: usuario.primerNombre,
      segundoNombre: usuario.segundoNombre,
      primerApellido: usuario.primerApellido,
      segundoApellido: usuario.segundoApellido,
      telefono: usuario.telefono,
    },
    'clave_secreta',  // Cambia esto por tu clave secreta
    { expiresIn: '1h' }  // Tiempo de expiración del token
  );
};

// Función para verificar un token JWT
const verificarToken = (token) => {
  try {
    return jwt.verify(token, 'clave_secreta');
  } catch (error) {
    return null;
  }
};

module.exports = { generarToken, verificarToken };
