import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import MapComponent from './MapComponent';
import { searchLocation } from '../../services/maps.service';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SelectedLocation = styled.div`
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-top: 1rem;

  h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
  }
`;

const LocationSelector = ({ onLocationSelect, initialLocation = null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const location = await searchLocation(searchQuery);
      setSelectedLocation(location);
      onLocationSelect(location);
    } catch (error) {
      setError('No se pudo encontrar la ubicación');
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(() => {
      handleSearch();
    }, 500),
    [searchQuery]
  );

  const handleMapClick = (location) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  return (
    <Container>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Buscar dirección..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            debouncedSearch();
          }}
        />
        <SearchButton
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
        >
          {isSearching ? 'Buscando...' : 'Buscar'}
        </SearchButton>
      </SearchContainer>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <MapComponent
        isSelectable={true}
        selectedLocation={selectedLocation}
        onLocationSelect={handleMapClick}
        markers={selectedLocation ? [selectedLocation] : []}
      />

      {selectedLocation && (
        <SelectedLocation>
          <h4>Ubicación seleccionada:</h4>
          <p>Latitud: {selectedLocation.lat.toFixed(6)}</p>
          <p>Longitud: {selectedLocation.lng.toFixed(6)}</p>
          {selectedLocation.formattedAddress && (
            <p>Dirección: {selectedLocation.formattedAddress}</p>
          )}
        </SelectedLocation>
      )}
    </Container>
  );
};

export default LocationSelector; 