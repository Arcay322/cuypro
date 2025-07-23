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
    <div className="container mt-4">
      <h2>Locations</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <Link to="/locations/new" className="btn btn-primary mb-3">Add New Location</Link>
      {locations.length === 0 && !error ? (
        <p>No locations found.</p>
      ) : (
        <ul className="list-group">
          {locations.map(location => (
            <li key={location.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {location.name} ({location.type}) - Capacity: {location.capacity}
                {location.last_cleaned_date && ` - Last Cleaned: ${location.last_cleaned_date}`}
              </div>
              <div>
                <Link to={`/locations/edit/${location.id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                <button onClick={() => handleDelete(location.id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationList;