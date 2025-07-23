import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface WeightLog {
  id?: number;
  animal: number;
  log_date: string;
  weight_kg: number;
}

interface Animal {
  id: number;
  unique_tag: string;
}

function WeightLogForm() {
  const [animal, setAnimal] = useState<number | null>(null);
  const [logDate, setLogDate] = useState('');
  const [weightKg, setWeightKg] = useState(0);
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
          const weightLogRes = await axios.get(`http://localhost:8000/api/weightlogs/${id}/`);
          setAnimal(weightLogRes.data.animal);
          setLogDate(weightLogRes.data.log_date);
          setWeightKg(weightLogRes.data.weight_kg);
        }
      } catch (err) {
        console.error('Error fetching data for weight log form:', err);
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

    const weightLogData: WeightLog = {
      animal,
      log_date: logDate,
      weight_kg: weightKg,
    };

    if (id) {
      // Update existing weight log
      axios.put(`http://localhost:8000/api/weightlogs/${id}/`, weightLogData)
        .then(() => {
          navigate('/weightlogs');
        })
        .catch(err => {
          console.error('Error updating weight log:', err);
          setError('Failed to update weight log.');
        });
    } else {
      // Create new weight log
      axios.post('http://localhost:8000/api/weightlogs/', weightLogData)
        .then(() => {
          navigate('/weightlogs');
        })
        .catch(err => {
          console.error('Error creating weight log:', err);
          setError('Failed to create weight log.');
        });
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Weight Log' : 'Add New Weight Log'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="animal">Animal:</label>
          <select id="animal" value={animal || ''} onChange={(e) => setAnimal(e.target.value ? parseInt(e.target.value) : null)} required>
            <option value="">-- Select Animal --</option>
            {animals.map(a => (
              <option key={a.id} value={a.id}>{a.unique_tag}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="logDate">Log Date:</label>
          <input
            type="date"
            id="logDate"
            value={logDate}
            onChange={(e) => setLogDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="weightKg">Weight (kg):</label>
          <input
            type="number"
            id="weightKg"
            step="0.01"
            value={weightKg}
            onChange={(e) => setWeightKg(parseFloat(e.target.value))}
            required
          />
        </div>
        <button type="submit">{id ? 'Update Weight Log' : 'Add Weight Log'}</button>
      </form>
      <button onClick={() => navigate('/weightlogs')}>Cancel</button>
    </div>
  );
}

export default WeightLogForm;
