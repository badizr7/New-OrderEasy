import axios from 'axios';

const API_URL = 'http://localhost:3000/api/ventas';

// Crear una venta
export const createVenta = async (venta, token) => {
  try {
    const response = await axios.post(
      API_URL,
      venta,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al registrar la venta.' };
  }
};

// Obtener todas las ventas del usuario
export const getVentas = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener las ventas.' };
  }
};