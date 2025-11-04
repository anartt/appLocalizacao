import * as Location from 'expo-location';
import axios from 'axios';

// Obter localização atual
export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return { success: false, error: 'Permissão de localização negada' };
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      success: true,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Geocodificação (endereço para coordenadas)
export const geocodeAddress = async (address, googleApiKey) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}`
    );

    if (response.data.results.length === 0) {
      return { success: false, error: 'Endereço não encontrado' };
    }

    const { lat, lng } = response.data.results[0].geometry.location;
    const formattedAddress = response.data.results[0].formatted_address;

    return {
      success: true,
      latitude: lat,
      longitude: lng,
      address: formattedAddress,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Geocodificação reversa (coordenadas para endereço)
export const reverseGeocode = async (latitude, longitude, googleApiKey) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`
    );

    if (response.data.results.length === 0) {
      return { success: false, error: 'Endereço não encontrado' };
    }

    const address = response.data.results[0].formatted_address;

    return {
      success: true,
      address,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};