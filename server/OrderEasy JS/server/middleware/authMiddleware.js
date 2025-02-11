const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  // Obtener el token de los encabezados
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    // Verificar y decodificar el token
    const usuario = jwt.verify(token, 'clave_secreta');
    
    // Adjuntar la información del usuario a la solicitud
    req.usuario = usuario;  // Aquí obtendrás el 'id' y demás datos

    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
  }
};

module.exports = { verificarToken };
