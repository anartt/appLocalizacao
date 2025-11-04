import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { getCurrentLocation, geocodeAddress, reverseGeocode } from '../services/locationService';
import { saveLocation, getLocations } from '../services/supabaseClient';

export default function GoogleMapsScreen() {
  const [lat, setLat] = useState(-23.5505);
  const [lng, setLng] = useState(-46.6333);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const GOOGLE_API_KEY = "AIzaSyBPlb5LVLyp5QivXeHOfn6h_uz8AizVpXo";

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    const result = await getLocations();
    if (result.success) {
      setLocations(result.data);
    }
  };

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    const result = await getCurrentLocation();
    if (result.success) {
      setLat(result.latitude);
      setLng(result.longitude);
      const reverseResult = await reverseGeocode(result.latitude, result.longitude, GOOGLE_API_KEY);
      if (reverseResult.success) {
        setAddress(reverseResult.address);
      }
    } else {
      Alert.alert('Erro', result.error);
    }
    setLoading(false);
  };

  const handleSearchAddress = async () => {
    if (!address.trim()) {
      Alert.alert('Aviso', 'Digite um endereço');
      return;
    }

    setLoading(true);
    const result = await geocodeAddress(address, GOOGLE_API_KEY);
    if (result.success) {
      setLat(result.latitude);
      setLng(result.longitude);
      setAddress(result.address);
    } else {
      Alert.alert('Erro', result.error);
    }
    setLoading(false);
  };

  const handleSaveLocation = async () => {
    const locationName = address || `Local ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    setLoading(true);
    const result = await saveLocation(locationName, lat, lng);
    if (result.success) {
      Alert.alert('Sucesso', 'Local salvo!');
      loadLocations();
    } else {
      Alert.alert('Erro', result.error);
    }
    setLoading(false);
  };

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: { lat: ${lat}, lng: ${lng} },
        });
        
        new google.maps.Marker({
          position: { lat: ${lat}, lng: ${lng} },
          map: map,
          title: '${address || 'Marcador'}',
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView source={{ html: mapHtml }} style={styles.map} />

      <ScrollView style={styles.panel}>
        <Text style={styles.title}>🗺️ Google Maps</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite um endereço"
          value={address}
          onChangeText={setAddress}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSearchAddress}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>🔍 Buscar</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.locationButton]}
          onPress={handleGetCurrentLocation}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>📍 Localização Atual</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSaveLocation}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>💾 Salvar Local</Text>}
        </TouchableOpacity>

        <Text style={styles.coordsText}>
          Lat: {lat.toFixed(4)} | Lng: {lng.toFixed(4)}
        </Text>

        <Text style={styles.subtitle}>Locais Salvos:</Text>
        {locations.map((loc) => (
          <View key={loc.id} style={styles.locationItem}>
            <Text style={styles.locationName}>{loc.nome}</Text>
            <Text style={styles.locationCoords}>
              {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 0.5,
  },
  panel: {
    flex: 0.5,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  locationButton: {
    backgroundColor: '#34A853',
  },
  saveButton: {
    backgroundColor: '#EA4335',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  coordsText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  locationItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#4285F4',
  },
  locationName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  locationCoords: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
});