const Usuario = require('../models/userModel');
const { generarToken } = require('../utils/jwt');

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
  try {
    const { primerNombre, segundoNombre, primerApellido, segundoApellido, correo, telefono, contraseña } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    // Crear el nuevo usuario
    const nuevoUsuario = new Usuario({
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      correo,
      telefono,
      contraseña,
    });

    // Guardar en la base de datos
    await nuevoUsuario.save();

    // Crear el token
    const token = generarToken(nuevoUsuario);

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente.', token });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar el usuario.', error });
  }
};


// Iniciar sesión
const loginUser = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findOne({ correo });
    if (!usuarioExistente) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // Verificar la contraseña
    if (usuarioExistente.contraseña !== contraseña) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    // Crear el token
    const token = generarToken(usuarioExistente);

    // Crear la variable usuario con los datos a enviar
    const usuario = {
      id: usuarioExistente._id,
      primerNombre: usuarioExistente.primerNombre,
      segundoNombre: usuarioExistente.segundoNombre,
      primerApellido: usuarioExistente.primerApellido,
      segundoApellido: usuarioExistente.segundoApellido,
      correo: usuarioExistente.correo,
      telefono: usuarioExistente.telefono,
    };

    res.status(200).json({ mensaje: 'Inicio de sesión exitoso.', token, usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión.', error });
  }
};

module.exports = { registerUser, loginUser };
