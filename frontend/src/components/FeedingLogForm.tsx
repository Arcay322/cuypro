import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface FeedingLog {
  id?: number;
  location: number;
  log_date: string;
  feed_type: string;
  quantity_kg: number;
}

interface Location {
  id: number;
  name: string;
}

function FeedingLogForm() {
  const [location, setLocation] = useState<number | null>(null);
  const [logDate, setLogDate] = useState('');
  const [feedType, setFeedType] = useState('');
  const [quantityKg, setQuantityKg] = useState(0);
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationsRes = await axios.get('http://localhost:8000/api/locations/');
        setLocations(locationsRes.data);

        if (id) {
          const feedingLogRes = await axios.get(`http://localhost:8000/api/feedinglogs/${id}/`);
          setLocation(feedingLogRes.data.location);
          setLogDate(feedingLogRes.data.log_date);
          setFeedType(feedingLogRes.data.feed_type);
          setQuantityKg(feedingLogRes.data.quantity_kg);
        }
      } catch (err) {
        console.error('Error fetching data for feeding log form:', err);
        setError('Failed to load form data. Please check the backend API.');
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (location === null) {
      setError('Please select a location.');
      return;
    }

    const feedingLogData: FeedingLog = {
      location,
      log_date: logDate,
      feed_type: feedType,
      quantity_kg: quantityKg,
    };

    if (id) {
      // Update existing feeding log
      axios.put(`http://localhost:8000/api/feedinglogs/${id}/`, feedingLogData)
        .then(() => {
          navigate('/feedinglogs');
        })
        .catch(err => {
          console.error('Error updating feeding log:', err);
          setError('Failed to update feeding log.');
        });
    } else {
      // Create new feeding log
      axios.post('http://localhost:8000/api/feedinglogs/', feedingLogData)
        .then(() => {
          navigate('/feedinglogs');
        })
        .catch(err => {
          console.error('Error creating feeding log:', err);
          setError('Failed to create feeding log.');
        });
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Feeding Log' : 'Add New Feeding Log'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="location">Location:</label>
          <select id="location" value={location || ''} onChange={(e) => setLocation(e.target.value ? parseInt(e.target.value) : null)} required>
            <option value="">-- Select Location --</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="logDate">Log Date:</label>
          <input
            type="date"
            id="logDate"
            value={logDate}
            onChange={(e) => setLogDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="feedType">Feed Type:</label>
          <input
            type="text"
            id="feedType"
            value={feedType}
            onChange={(e) => setFeedType(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="quantityKg">Quantity (kg):</label>
          <input
            type="number"
            id="quantityKg"
            step="0.01"
            value={quantityKg}
            onChange={(e) => setQuantityKg(parseFloat(e.target.value))}
            required
          />
        </div>
        <button type="submit">{id ? 'Update Feeding Log' : 'Add Feeding Log'}</button>
      </form>
      <button onClick={() => navigate('/feedinglogs')}>Cancel</button>
    </div>
  );
}

export default FeedingLogForm;
