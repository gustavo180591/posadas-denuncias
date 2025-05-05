const axios = require('axios');

class MapsService {
  constructor() {
    this.nominatimUrl = 'https://nominatim.openstreetmap.org';
  }

  async geocode(address) {
    try {
      const response = await axios.get(`${this.nominatimUrl}/search`, {
        params: {
          q: address,
          format: 'json',
          limit: 1,
          addressdetails: 1,
          'accept-language': 'es'
        },
        headers: {
          'User-Agent': 'PosadasDenuncias/1.0'
        }
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          formattedAddress: result.display_name
        };
      }

      throw new Error('No se pudo geocodificar la dirección');
    } catch (error) {
      console.error('Error en geocodificación:', error);
      throw new Error('Error al geocodificar la dirección');
    }
  }

  async validateLocation(lat, lng) {
    try {
      // Verificar que las coordenadas estén dentro de los límites de Posadas
      const posadasBounds = {
        north: -27.35,
        south: -27.40,
        east: -55.85,
        west: -55.95
      };

      if (
        lat < posadasBounds.south ||
        lat > posadasBounds.north ||
        lng < posadasBounds.west ||
        lng > posadasBounds.east
      ) {
        throw new Error('La ubicación está fuera de los límites de Posadas');
      }

      // Verificar que la ubicación sea accesible usando reverse geocoding
      const response = await axios.get(`${this.nominatimUrl}/reverse`, {
        params: {
          lat,
          lon: lng,
          format: 'json',
          addressdetails: 1,
          'accept-language': 'es'
        },
        headers: {
          'User-Agent': 'PosadasDenuncias/1.0'
        }
      });

      if (!response.data || !response.data.display_name) {
        throw new Error('Ubicación no válida');
      }

      return {
        isValid: true,
        address: response.data.display_name
      };
    } catch (error) {
      console.error('Error en validación de ubicación:', error);
      throw new Error('Error al validar la ubicación');
    }
  }

  async getNearbyPoliceStations(lat, lng) {
    try {
      // Usar Overpass API para buscar comisarías cercanas
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="police"](around:5000,${lat},${lng});
          way["amenity"="police"](around:5000,${lat},${lng});
          relation["amenity"="police"](around:5000,${lat},${lng});
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data && response.data.elements) {
        return response.data.elements
          .filter(element => element.type === 'node')
          .map(station => ({
            name: station.tags.name || 'Comisaría',
            address: station.tags['addr:street'] || 'Sin dirección',
            location: {
              lat: station.lat,
              lng: station.lon
            },
            distance: this.calculateDistance(
              lat,
              lng,
              station.lat,
              station.lon
            )
          }))
          .sort((a, b) => a.distance - b.distance);
      }

      return [];
    } catch (error) {
      console.error('Error al obtener comisarías cercanas:', error);
      return [];
    }
  }

  // Función auxiliar para calcular distancia entre dos puntos
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }
}

module.exports = new MapsService(); 