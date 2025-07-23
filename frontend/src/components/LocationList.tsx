import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Location {
  id: number;
  name: string;
  type: string;
  capacity: number;
  last_cleaned_date: string | null;
}

function LocationList() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/locations/')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error('Error fetching locations:', error);
        setError('Failed to load locations. Please check the backend API.');
      });
  }, []);

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8000/api/locations/${id}/`)
      .then(() => {
        setLocations(locations.filter(location => location.id !== id));
      })
      .catch(error => {
        console.error('Error deleting location:', error);
        setError('Failed to delete location.');
      });
  };

  return (
    <div>
      <h2>Locations</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Link to="/locations/new">Add New Location</Link>
      {locations.length === 0 && !error ? (
        <p>No locations found.</p>
      ) : (
        <ul>
          {locations.map(location => (
            <li key={location.id}>
              {location.name} ({location.type}) - Capacity: {location.capacity}
              {location.last_cleaned_date && ` - Last Cleaned: ${location.last_cleaned_date}`}
              <Link to={`/locations/edit/${location.id}`}>Edit</Link>
              <button onClick={() => handleDelete(location.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationList;
