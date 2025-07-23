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
    <div>
      <h2>{id ? 'Edit Line' : 'Add New Line'}</h2>
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
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">{id ? 'Update Line' : 'Add Line'}</button>
      </form>
      <button onClick={() => navigate('/lines')}>Cancel</button>
    </div>
  );
}

export default LineForm;
