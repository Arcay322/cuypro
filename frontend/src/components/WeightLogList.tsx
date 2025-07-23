import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface WeightLog {
  id: number;
  animal: number;
  log_date: string;
  weight_kg: number;
}

interface Animal {
  id: number;
  unique_tag: string;
}

function WeightLogList() {
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weightLogsRes, animalsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/weightlogs/'),
          axios.get('http://localhost:8000/api/animals/'),
        ]);
        setWeightLogs(weightLogsRes.data);
        setAnimals(animalsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load weight logs. Please check the backend API.');
      }
    };
    fetchData();
  }, []);

  const getAnimalTag = (animalId: number) => {
    const animal = animals.find(a => a.id === animalId);
    return animal ? animal.unique_tag : 'N/A';
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8000/api/weightlogs/${id}/`)
      .then(() => {
        setWeightLogs(weightLogs.filter(log => log.id !== id));
      })
      .catch(err => {
        console.error('Error deleting weight log:', err);
        setError('Failed to delete weight log.');
      });
  };

  return (
    <div>
      <h2>Weight Logs</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Link to="/weightlogs/new">Add New Weight Log</Link>
      {weightLogs.length === 0 && !error ? (
        <p>No weight logs found.</p>
      ) : (
        <ul>
          {weightLogs.map(log => (
            <li key={log.id}>
              Animal: {getAnimalTag(log.animal)} - Date: {log.log_date} - Weight: {log.weight_kg} kg
              <Link to={`/weightlogs/edit/${log.id}`}>Edit</Link>
              <button onClick={() => handleDelete(log.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WeightLogList;
