// src/services/authServicesjs
import axios from 'axios';

// Función para manejar el login
const loginUser = async (correo, contraseña) => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      correo,
      contraseña,
    });
    return response.data; // Devolver la respuesta con el token
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.mensaje); // Manejar el mensaje de error del backend
    } else {
      throw new Error('Error al conectar con el servidor.');
    }
  }
};

export { loginUser };
