import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Line {
  id?: number;
  name: string;
  description: string;
}

function LineForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/lines/${id}/`)
        .then(response => {
          setName(response.data.name);
          setDescription(response.data.description);
        })
        .catch(error => {
          console.error('Error fetching line:', error);
          setError('Failed to load line for editing.');
        });
    }
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const lineData: Line = { name, description };

    if (id) {
      // Update existing line
      axios.put(`http://localhost:8000/api/lines/${id}/`, lineData)
        .then(() => {
          navigate('/lines');
        })
        .catch(error => {
          console.error('Error updating line:', error);
          setError('Failed to update line.');
        });
    } else {
      // Create new line
      axios.post('http://localhost:8000/api/lines/', lineData)
        .then(() => {
          navigate('/lines');
        })
        .catch(error => {
          console.error('Error creating line:', error);
          setError('Failed to create line.');
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Edit Line' : 'Add New Line'}</h2>
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
          <label htmlFor="description" className="form-label">Description:</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">{id ? 'Update Line' : 'Add Line'}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/lines')}>Cancel</button>
      </form>
    </div>
  );
}

export default LineForm;