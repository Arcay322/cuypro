import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Animal {
  id: number;
  unique_tag: string;
  birth_date: string;
  sex: string;
  status: string;
  line: number | null;
  sire: number | null;
  dam: number | null;
  location: number | null;
}

interface Line {
  id: number;
  name: string;
}

interface Location {
  id: number;
  name: string;
}

function AnimalList() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [animalsRes, linesRes, locationsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/animals/'),
          axios.get('http://localhost:8000/api/lines/'),
          axios.get('http://localhost:8000/api/locations/'),
        ]);
        setAnimals(animalsRes.data);
        setLines(linesRes.data);
        setLocations(locationsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please check the backend API.');
      }
    };
    fetchData();
  }, []);

  const getLineName = (lineId: number | null) => {
    const line = lines.find(l => l.id === lineId);
    return line ? line.name : 'N/A';
  };

  const getLocationName = (locationId: number | null) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'N/A';
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8000/api/animals/${id}/`)
      .then(() => {
        setAnimals(animals.filter(animal => animal.id !== id));
      })
      .catch(err => {
        console.error('Error deleting animal:', err);
        setError('Failed to delete animal.');
      });
  };

  return (
    <div className="container mt-4">
      <h2>Animals</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <Link to="/animals/new" className="btn btn-primary mb-3">Add New Animal</Link>
      {animals.length === 0 && !error ? (
        <p>No animals found.</p>
      ) : (
        <ul className="list-group">
          {animals.map(animal => (
            <li key={animal.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {animal.unique_tag} - {animal.sex} - {animal.status} - Line: {getLineName(animal.line)} - Location: {getLocationName(animal.location)}
              </div>
              <div>
                <Link to={`/animals/edit/${animal.id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                <button onClick={() => handleDelete(animal.id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AnimalList;