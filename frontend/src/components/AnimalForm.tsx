import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Animal {
  id?: number;
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

function AnimalForm() {
  const [uniqueTag, setUniqueTag] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState('M');
  const [status, setStatus] = useState('Active');
  const [line, setLine] = useState<number | null>(null);
  const [sire, setSire] = useState<number | null>(null);
  const [dam, setDam] = useState<number | null>(null);
  const [location, setLocation] = useState<number | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]); // For sire/dam selection
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [linesRes, locationsRes, animalsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/lines/'),
          axios.get('http://localhost:8000/api/locations/'),
          axios.get('http://localhost:8000/api/animals/'),
        ]);
        setLines(linesRes.data);
        setLocations(locationsRes.data);
        setAnimals(animalsRes.data);

        if (id) {
          const animalRes = await axios.get(`http://localhost:8000/api/animals/${id}/`);
          setUniqueTag(animalRes.data.unique_tag);
          setBirthDate(animalRes.data.birth_date);
          setSex(animalRes.data.sex);
          setStatus(animalRes.data.status);
          setLine(animalRes.data.line);
          setSire(animalRes.data.sire);
          setDam(animalRes.data.dam);
          setLocation(animalRes.data.location);
        }
      } catch (err) {
        console.error('Error fetching data for animal form:', err);
        setError('Failed to load form data. Please check the backend API.');
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const animalData: Animal = {
      unique_tag: uniqueTag,
      birth_date: birthDate,
      sex,
      status,
      line,
      sire,
      dam,
      location,
    };

    if (id) {
      // Update existing animal
      axios.put(`http://localhost:8000/api/animals/${id}/`, animalData)
        .then(() => {
          navigate('/animals');
        })
        .catch(err => {
          console.error('Error updating animal:', err);
          setError('Failed to update animal.');
        });
    } else {
      // Create new animal
      axios.post('http://localhost:8000/api/animals/', animalData)
        .then(() => {
          navigate('/animals');
        })
        .catch(err => {
          console.error('Error creating animal:', err);
          setError('Failed to create animal.');
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Edit Animal' : 'Add New Animal'}</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="uniqueTag" className="form-label">Unique Tag:</label>
          <input
            type="text"
            id="uniqueTag"
            className="form-control"
            value={uniqueTag}
            onChange={(e) => setUniqueTag(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="birthDate" className="form-label">Birth Date:</label>
          <input
            type="date"
            id="birthDate"
            className="form-control"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="sex" className="form-label">Sex:</label>
          <select id="sex" className="form-select" value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status:</label>
          <select id="status" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="In Quarantine">In Quarantine</option>
            <option value="Sick">Sick</option>
            <option value="Pregnant">Pregnant</option>
            <option value="Retired">Retired</option>
            <option value="Sold">Sold</option>
            <option value="Deceased">Deceased</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="line" className="form-label">Line:</label>
          <select id="line" className="form-select" value={line || ''} onChange={(e) => setLine(e.target.value ? parseInt(e.target.value) : null)}>
            <option value="">-- Select Line --</option>
            {lines.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="sire" className="form-label">Sire:</label>
          <select id="sire" className="form-select" value={sire || ''} onChange={(e) => setSire(e.target.value ? parseInt(e.target.value) : null)}>
            <option value="">-- Select Sire --</option>
            {animals.filter(a => a.sex === 'M').map(a => (
              <option key={a.id} value={a.id}>{a.unique_tag}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="dam" className="form-label">Dam:</label>
          <select id="dam" className="form-select" value={dam || ''} onChange={(e) => setDam(e.target.value ? parseInt(e.target.value) : null)}>
            <option value="">-- Select Dam --</option>
            {animals.filter(a => a.sex === 'F').map(a => (
              <option key={a.id} value={a.id}>{a.unique_tag}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location:</label>
          <select id="location" className="form-select" value={location || ''} onChange={(e) => setLocation(e.target.value ? parseInt(e.target.value) : null)}>
            <option value="">-- Select Location --</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">{id ? 'Update Animal' : 'Add Animal'}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/animals')}>Cancel</button>
      </form>
    </div>
  );
}

export default AnimalForm;
