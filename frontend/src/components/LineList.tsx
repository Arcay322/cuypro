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
    <div className="container mt-4">
      <h2>Lines</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <Link to="/lines/new" className="btn btn-primary mb-3">Add New Line</Link>
      {lines.length === 0 && !error ? (
        <p>No lines found.</p>
      ) : (
        <ul className="list-group">
          {lines.map(line => (
            <li key={line.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {line.name} - {line.description}
              </div>
              <div>
                <Link to={`/lines/edit/${line.id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                <button onClick={() => handleDelete(line.id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LineList;