import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface HealthLog {
  id: number;
  animal: number;
  log_date: string;
  diagnosis: string;
  notes: string;
}

interface Animal {
  id: number;
  unique_tag: string;
}

function HealthLogList() {
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthLogsRes, animalsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/healthlogs/'),
          axios.get('http://localhost:8000/api/animals/'),
        ]);
        setHealthLogs(healthLogsRes.data);
        setAnimals(animalsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load health logs. Please check the backend API.');
      }
    };
    fetchData();
  }, []);

  const getAnimalTag = (animalId: number) => {
    const animal = animals.find(a => a.id === animalId);
    return animal ? animal.unique_tag : 'N/A';
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8000/api/healthlogs/${id}/`)
      .then(() => {
        setHealthLogs(healthLogs.filter(log => log.id !== id));
      })
      .catch(err => {
        console.error('Error deleting health log:', err);
        setError('Failed to delete health log.');
      });
  };

  return (
    <div className="container mt-4">
      <h2>Health Logs</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <Link to="/healthlogs/new" className="btn btn-primary mb-3">Add New Health Log</Link>
      {healthLogs.length === 0 && !error ? (
        <p>No health logs found.</p>
      ) : (
        <ul className="list-group">
          {healthLogs.map(log => (
            <li key={log.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                Animal: {getAnimalTag(log.animal)} - Date: {log.log_date} - Diagnosis: {log.diagnosis}
              </div>
              <div>
                <Link to={`/healthlogs/edit/${log.id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                <button onClick={() => handleDelete(log.id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HealthLogList;