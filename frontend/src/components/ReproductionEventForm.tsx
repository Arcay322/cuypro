import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface ReproductionEvent {
  id?: number;
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
  sex: string;
}

function ReproductionEventForm() {
  const [female, setFemale] = useState<number | null>(null);
  const [male, setMale] = useState<number | null>(null);
  const [matingDate, setMatingDate] = useState('');
  const [expectedBirthDate, setExpectedBirthDate] = useState<string | null>(null);
  const [actualBirthDate, setActualBirthDate] = useState<string | null>(null);
  const [liveBirths, setLiveBirths] = useState<number | null>(null);
  const [deadBirths, setDeadBirths] = useState<number | null>(null);
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
          const reproductionEventRes = await axios.get(`http://localhost:8000/api/reproductionevents/${id}/`);
          setFemale(reproductionEventRes.data.female);
          setMale(reproductionEventRes.data.male);
          setMatingDate(reproductionEventRes.data.mating_date);
          setExpectedBirthDate(reproductionEventRes.data.expected_birth_date);
          setActualBirthDate(reproductionEventRes.data.actual_birth_date);
          setLiveBirths(reproductionEventRes.data.live_births);
          setDeadBirths(reproductionEventRes.data.dead_births);
        }
      } catch (err) {
        console.error('Error fetching data for reproduction event form:', err);
        setError('Failed to load form data. Please check the backend API.');
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (female === null) {
      setError('Please select a female animal.');
      return;
    }

    const reproductionEventData: ReproductionEvent = {
      female,
      male,
      mating_date: matingDate,
      expected_birth_date: expectedBirthDate,
      actual_birth_date: actualBirthDate,
      live_births: liveBirths,
      dead_births: deadBirths,
    };

    if (id) {
      // Update existing reproduction event
      axios.put(`http://localhost:8000/api/reproductionevents/${id}/`, reproductionEventData)
        .then(() => {
          navigate('/reproductionevents');
        })
        .catch(err => {
          console.error('Error updating reproduction event:', err);
          setError('Failed to update reproduction event.');
        });
    } else {
      // Create new reproduction event
      axios.post('http://localhost:8000/api/reproductionevents/', reproductionEventData)
        .then(() => {
          navigate('/reproductionevents');
        })
        .catch(err => {
          console.error('Error creating reproduction event:', err);
          setError('Failed to create reproduction event.');
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Edit Reproduction Event' : 'Add New Reproduction Event'}</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="female" className="form-label">Female:</label>
          <select id="female" className="form-select" value={female || ''} onChange={(e) => setFemale(e.target.value ? parseInt(e.target.value) : null)} required>
            <option value="">-- Select Female --</option>
            {animals.filter(a => a.sex === 'F').map(a => (
              <option key={a.id} value={a.id}>{a.unique_tag}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="male" className="form-label">Male:</label>
          <select id="male" className="form-select" value={male || ''} onChange={(e) => setMale(e.target.value ? parseInt(e.target.value) : null)}>
            <option value="">-- Select Male --</option>
            {animals.filter(a => a.sex === 'M').map(a => (
              <option key={a.id} value={a.id}>{a.unique_tag}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="matingDate" className="form-label">Mating Date:</label>
          <input
            type="date"
            id="matingDate"
            className="form-control"
            value={matingDate}
            onChange={(e) => setMatingDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="expectedBirthDate" className="form-label">Expected Birth Date:</label>
          <input
            type="date"
            id="expectedBirthDate"
            className="form-control"
            value={expectedBirthDate || ''}
            onChange={(e) => setExpectedBirthDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="actualBirthDate" className="form-label">Actual Birth Date:</label>
          <input
            type="date"
            id="actualBirthDate"
            className="form-control"
            value={actualBirthDate || ''}
            onChange={(e) => setActualBirthDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="liveBirths" className="form-label">Live Births:</label>
          <input
            type="number"
            id="liveBirths"
            className="form-control"
            value={liveBirths || ''}
            onChange={(e) => setLiveBirths(e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="deadBirths" className="form-label">Dead Births:</label>
          <input
            type="number"
            id="deadBirths"
            className="form-control"
            value={deadBirths || ''}
            onChange={(e) => setDeadBirths(e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>
        <button type="submit" className="btn btn-primary">{id ? 'Update Event' : 'Add Event'}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/reproductionevents')}>Cancel</button>
      </form>
    </div>
  );
}

export default ReproductionEventForm;
