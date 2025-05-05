import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';

// Importar los íconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Corregir el problema de los íconos en producción
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapContainer = styled.div`
  height: 400px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MapComponent = ({ 
  center = [-27.3631, -55.9008], // Centro de Posadas
  zoom = 13,
  markers = [],
  onLocationSelect,
  isSelectable = false,
  selectedLocation = null
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Inicializar el mapa
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      // Agregar capa de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Si el mapa es seleccionable, agregar el evento de clic
      if (isSelectable) {
        mapInstanceRef.current.on('click', (e) => {
          const { lat, lng } = e.latlng;
          onLocationSelect({ lat, lng });
        });
      }
    }

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Agregar marcadores
    markers.forEach(marker => {
      const newMarker = L.marker([marker.lat, marker.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(marker.popup || '');
      markersRef.current.push(newMarker);
    });

    // Si hay una ubicación seleccionada, centrar el mapa en ella
    if (selectedLocation) {
      mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], zoom);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, markers, isSelectable, selectedLocation]);

  return <MapContainer ref={mapRef} />;
};

export default MapComponent; 