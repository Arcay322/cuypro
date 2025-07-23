import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface HealthLog {
  id?: number;
  animal: number;
  log_date: string;
  diagnosis: string;
  notes: string;
}

interface Animal {
  id: number;
  unique_tag: string;
}

function HealthLogForm() {
  const [animal, setAnimal] = useState<number | null>(null);
  const [logDate, setLogDate] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const animalsRes = await axios.get('http://localhost:8000/api/animals/');
        setAnimals(animalsRes.data);

        if (id) {
          const healthLogRes = await axios.get(`http://localhost:8000/api/healthlogs/${id}/`);
          setAnimal(healthLogRes.data.animal);
          setLogDate(healthLogRes.data.log_date);
          setDiagnosis(healthLogRes.data.diagnosis);
          setNotes(healthLogRes.data.notes);
        }
      } catch (err) {
        console.error('Error fetching data for health log form:', err);
        setError('Failed to load form data. Please check the backend API.');
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (animal === null) {
      setError('Please select an animal.');
      return;
    }

    const healthLogData: HealthLog = {
      animal,
      log_date: logDate,
      diagnosis,
      notes,
    };

    if (id) {
      // Update existing health log
      axios.put(`http://localhost:8000/api/healthlogs/${id}/`, healthLogData)
        .then(() => {
          navigate('/healthlogs');
        })
        .catch(err => {
          console.error('Error updating health log:', err);
          setError('Failed to update health log.');
        });
    } else {
      // Create new health log
      axios.post('http://localhost:8000/api/healthlogs/', healthLogData)
        .then(() => {
          navigate('/healthlogs');
        })
        .catch(err => {
          console.error('Error creating health log:', err);
          setError('Failed to create health log.');
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Edit Health Log' : 'Add New Health Log'}</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="animal" className="form-label">Animal:</label>
          <select id="animal" className="form-select" value={animal || ''} onChange={(e) => setAnimal(e.target.value ? parseInt(e.target.value) : null)} required>
            <option value="">-- Select Animal --</option>
            {animals.map(a => (
              <option key={a.id} value={a.id}>{a.unique_tag}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="logDate" className="form-label">Log Date:</label>
          <input
            type="date"
            id="logDate"
            className="form-control"
            value={logDate}
            onChange={(e) => setLogDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="diagnosis" className="form-label">Diagnosis:</label>
          <textarea
            id="diagnosis"
            className="form-control"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="notes" className="form-label">Notes:</label>
          <textarea
            id="notes"
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">{id ? 'Update Health Log' : 'Add Health Log'}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/healthlogs')}>Cancel</button>
      </form>
    </div>
  );
}

export default HealthLogForm;
