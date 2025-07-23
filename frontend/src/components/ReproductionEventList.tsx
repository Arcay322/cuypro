import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface ReproductionEvent {
  id: number;
  female: number;
  male: number | null;
  mating_date: string;
  expected_birth_date: string | null;
  actual_birth_date: string | null;
  live_births: number | null;
  dead_births: number | null;
}

interface Animal {
  id: number;
  unique_tag: string;
}

function ReproductionEventList() {
  const [reproductionEvents, setReproductionEvents] = useState<ReproductionEvent[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reproductionEventsRes, animalsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/reproductionevents/'),
          axios.get('http://localhost:8000/api/animals/'),
        ]);
        setReproductionEvents(reproductionEventsRes.data);
        setAnimals(animalsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load reproduction events. Please check the backend API.');
      }
    };
    fetchData();
  }, []);

  const getAnimalTag = (animalId: number | null) => {
    if (animalId === null) return 'N/A';
    const animal = animals.find(a => a.id === animalId);
    return animal ? animal.unique_tag : 'N/A';
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8000/api/reproductionevents/${id}/`)
      .then(() => {
        setReproductionEvents(reproductionEvents.filter(event => event.id !== id));
      })
      .catch(err => {
        console.error('Error deleting reproduction event:', err);
        setError('Failed to delete reproduction event.');
      });
  };

  return (
    <div>
      <h2>Reproduction Events</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Link to="/reproductionevents/new">Add New Reproduction Event</Link>
      {reproductionEvents.length === 0 && !error ? (
        <p>No reproduction events found.</p>
      ) : (
        <ul>
          {reproductionEvents.map(event => (
            <li key={event.id}>
              Female: {getAnimalTag(event.female)} - Male: {getAnimalTag(event.male)} - Mating: {event.mating_date}
              {event.actual_birth_date && ` - Born: ${event.actual_birth_date}`}
              {event.live_births !== null && ` - Live: ${event.live_births}`}
              {event.dead_births !== null && ` - Dead: ${event.dead_births}`}
              <Link to={`/reproductionevents/edit/${event.id}`}>Edit</Link>
              <button onClick={() => handleDelete(event.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReproductionEventList;
