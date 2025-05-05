import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const searchLocation = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/maps/geocode`, {
      params: { address: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching location:', error);
    throw new Error('No se pudo encontrar la ubicación');
  }
};

export const validateLocation = async (lat, lng) => {
  try {
    const response = await axios.get(`${API_URL}/maps/validate`, {
      params: { lat, lng }
    });
    return response.data;
  } catch (error) {
    console.error('Error validating location:', error);
    throw new Error('La ubicación no es válida');
  }
};

export const getNearbyPoliceStations = async (lat, lng) => {
  try {
    const response = await axios.get(`${API_URL}/maps/nearby-police`, {
      params: { lat, lng }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting nearby police stations:', error);
    return [];
  }
}; 