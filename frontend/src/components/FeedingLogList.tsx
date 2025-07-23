import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface FeedingLog {
  id: number;
  location: number;
  log_date: string;
  feed_type: string;
  quantity_kg: number;
}

interface Location {
  id: number;
  name: string;
}

function FeedingLogList() {
  const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedingLogsRes, locationsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/feedinglogs/'),
          axios.get('http://localhost:8000/api/locations/'),
        ]);
        setFeedingLogs(feedingLogsRes.data);
        setLocations(locationsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load feeding logs. Please check the backend API.');
      }
    };
    fetchData();
  }, []);

  const getLocationName = (locationId: number) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'N/A';
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8000/api/feedinglogs/${id}/`)
      .then(() => {
        setFeedingLogs(feedingLogs.filter(log => log.id !== id));
      })
      .catch(err => {
        console.error('Error deleting feeding log:', err);
        setError('Failed to delete feeding log.');
      });
  };

  return (
    <div>
      <h2>Feeding Logs</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Link to="/feedinglogs/new">Add New Feeding Log</Link>
      {feedingLogs.length === 0 && !error ? (
        <p>No feeding logs found.</p>
      ) : (
        <ul>
          {feedingLogs.map(log => (
            <li key={log.id}>
              Location: {getLocationName(log.location)} - Date: {log.log_date} - Type: {log.feed_type} - Quantity: {log.quantity_kg} kg
              <Link to={`/feedinglogs/edit/${log.id}`}>Edit</Link>
              <button onClick={() => handleDelete(log.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FeedingLogList;
