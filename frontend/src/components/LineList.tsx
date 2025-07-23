import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Line {
  id: number;
  name: string;
  description: string;
}

function LineList() {
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/lines/')
      .then(response => {
        setLines(response.data);
      })
      .catch(error => {
        console.error('Error fetching lines:', error);
        setError('Failed to load lines. Please check the backend API.');
      });
  }, []);

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8000/api/lines/${id}/`)
      .then(() => {
        setLines(lines.filter(line => line.id !== id));
      })
      .catch(error => {
        console.error('Error deleting line:', error);
        setError('Failed to delete line.');
      });
  };

  return (
    <div>
      <h2>Lines</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Link to="/lines/new">Add New Line</Link>
      {lines.length === 0 && !error ? (
        <p>No lines found.</p>
      ) : (
        <ul>
          {lines.map(line => (
            <li key={line.id}>
              {line.name} - {line.description}
              <Link to={`/lines/edit/${line.id}`}>Edit</Link>
              <button onClick={() => handleDelete(line.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LineList;
