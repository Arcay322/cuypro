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
    <div>
      <h2>{id ? 'Edit Location' : 'Add New Location'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Poza">Poza</option>
            <option value="Jaula">Jaula</option>
          </select>
        </div>
        <div>
          <label htmlFor="capacity">Capacity:</label>
          <input
            type="number"
            id="capacity"
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="lastCleanedDate">Last Cleaned Date:</label>
          <input
            type="date"
            id="lastCleanedDate"
            value={lastCleanedDate || ''}
            onChange={(e) => setLastCleanedDate(e.target.value)}
          />
        </div>
        <button type="submit">{id ? 'Update Location' : 'Add Location'}</button>
      </form>
      <button onClick={() => navigate('/locations')}>Cancel</button>
    </div>
  );
}

export default LocationForm;
