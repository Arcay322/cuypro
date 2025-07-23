import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Location {
  id?: number;
  name: string;
  type: string;
  capacity: number;
  last_cleaned_date: string | null;
}

function LocationForm() {
  const [name, setName] = useState('');
  const [type, setType] = useState('Poza'); // Default to Poza
  const [capacity, setCapacity] = useState(0);
  const [lastCleanedDate, setLastCleanedDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/locations/${id}/`)
        .then(response => {
          setName(response.data.name);
          setType(response.data.type);
          setCapacity(response.data.capacity);
          setLastCleanedDate(response.data.last_cleaned_date);
        })
        .catch(error => {
          console.error('Error fetching location:', error);
          setError('Failed to load location for editing.');
        });
    }
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const locationData: Location = {
      name,
      type,
      capacity,
      last_cleaned_date: lastCleanedDate,
    };

    if (id) {
      // Update existing location
      axios.put(`http://localhost:8000/api/locations/${id}/`, locationData)
        .then(() => {
          navigate('/locations');
        })
        .catch(error => {
          console.error('Error updating location:', error);
          setError('Failed to update location.');
        });
    } else {
      // Create new location
      axios.post('http://localhost:8000/api/locations/', locationData)
        .then(() => {
          navigate('/locations');
        })
        .catch(error => {
          console.error('Error creating location:', error);
          setError('Failed to create location.');
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Edit Location' : 'Add New Location'}</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name:</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">Type:</label>
          <select id="type" className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Poza">Poza</option>
            <option value="Jaula">Jaula</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="capacity" className="form-label">Capacity:</label>
          <input
            type="number"
            id="capacity"
            className="form-control"
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastCleanedDate" className="form-label">Last Cleaned Date:</label>
          <input
            type="date"
            id="lastCleanedDate"
            className="form-control"
            value={lastCleanedDate || ''}
            onChange={(e) => setLastCleanedDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">{id ? 'Update Location' : 'Add Location'}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/locations')}>Cancel</button>
      </form>
    </div>
  );
}

export default LocationForm;