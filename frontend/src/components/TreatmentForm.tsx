import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Treatment {
  id?: number;
  health_log: number;
  medication: number | null;
  dosage: string;
  withdrawal_end_date: string | null;
}

interface HealthLog {
  id: number;
  animal: number;
  log_date: string;
  diagnosis: string;
}

interface Medication {
  id: number;
  name: string;
}

interface Animal {
  id: number;
  unique_tag: string;
}

function TreatmentForm() {
  const [healthLog, setHealthLog] = useState<number | null>(null);
  const [medication, setMedication] = useState<number | null>(null);
  const [dosage, setDosage] = useState('');
  const [withdrawalEndDate, setWithdrawalEndDate] = useState<string | null>(null);
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]); // To display animal tag in health log select
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthLogsRes, medicationsRes, animalsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/healthlogs/'),
          axios.get('http://localhost:8000/api/medications/'),
          axios.get('http://localhost:8000/api/animals/'),
        ]);
        setHealthLogs(healthLogsRes.data);
        setMedications(medicationsRes.data);
        setAnimals(animalsRes.data);

        if (id) {
          const treatmentRes = await axios.get(`http://localhost:8000/api/treatments/${id}/`);
          setHealthLog(treatmentRes.data.health_log);
          setMedication(treatmentRes.data.medication);
          setDosage(treatmentRes.data.dosage);
          setWithdrawalEndDate(treatmentRes.data.withdrawal_end_date);
        }
      } catch (err) {
        console.error('Error fetching data for treatment form:', err);
        setError('Failed to load form data. Please check the backend API.');
      }
    };
    fetchData();
  }, [id]);

  const getHealthLogOptionLabel = (log: HealthLog) => {
    const animal = animals.find(a => a.id === log.animal);
    return `${animal ? animal.unique_tag : 'N/A'} - ${log.log_date} - ${log.diagnosis}`;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (healthLog === null) {
      setError('Please select a health log.');
      return;
    }

    const treatmentData: Treatment = {
      health_log: healthLog,
      medication,
      dosage,
      withdrawal_end_date: withdrawalEndDate,
    };

    if (id) {
      // Update existing treatment
      axios.put(`http://localhost:8000/api/treatments/${id}/`, treatmentData)
        .then(() => {
          navigate('/treatments');
        })
        .catch(err => {
          console.error('Error updating treatment:', err);
          setError('Failed to update treatment.');
        });
    } else {
      // Create new treatment
      axios.post('http://localhost:8000/api/treatments/', treatmentData)
        .then(() => {
          navigate('/treatments');
        })
        .catch(err => {
          console.error('Error creating treatment:', err);
          setError('Failed to create treatment.');
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Edit Treatment' : 'Add New Treatment'}</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="healthLog" className="form-label">Health Log:</label>
          <select id="healthLog" className="form-select" value={healthLog || ''} onChange={(e) => setHealthLog(e.target.value ? parseInt(e.target.value) : null)} required>
            <option value="">-- Select Health Log --</option>
            {healthLogs.map(log => (
              <option key={log.id} value={log.id}>{getHealthLogOptionLabel(log)}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="medication" className="form-label">Medication:</label>
          <select id="medication" className="form-select" value={medication || ''} onChange={(e) => setMedication(e.target.value ? parseInt(e.target.value) : null)}>
            <option value="">-- Select Medication --</option>
            {medications.map(med => (
              <option key={med.id} value={med.id}>{med.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="dosage" className="form-label">Dosage:</label>
          <input
            type="text"
            id="dosage"
            className="form-control"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="withdrawalEndDate" className="form-label">Withdrawal End Date:</label>
          <input
            type="date"
            id="withdrawalEndDate"
            className="form-control"
            value={withdrawalEndDate || ''}
            onChange={(e) => setWithdrawalEndDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">{id ? 'Update Treatment' : 'Add Treatment'}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/treatments')}>Cancel</button>
      </form>
    </div>
  );
}

export default TreatmentForm;