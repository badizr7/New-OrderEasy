import axios from 'axios';

const API_URL = 'http://localhost:3000/api/egresos';

// Crear un egreso
export const createEgreso = async (egreso, token) => {
  try {
    const response = await axios.post(
      API_URL,
      egreso,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al registrar el egreso.' };
  }
};

// Obtener todos los egresos del usuario
export const getEgresos = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener los egresos.' };
  }
};
