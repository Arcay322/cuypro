import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Treatment {
  id: number;
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

function TreatmentList() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [treatmentsRes, healthLogsRes, medicationsRes, animalsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/treatments/'),
          axios.get('http://localhost:8000/api/healthlogs/'),
          axios.get('http://localhost:8000/api/medications/'),
          axios.get('http://localhost:8000/api/animals/'),
        ]);
        setTreatments(treatmentsRes.data);
        setHealthLogs(healthLogsRes.data);
        setMedications(medicationsRes.data);
        setAnimals(animalsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load treatments. Please check the backend API.');
      }
    };
    fetchData();
  }, []);

  const getHealthLogInfo = (healthLogId: number) => {
    const log = healthLogs.find(l => l.id === healthLogId);
    if (!log) return 'N/A';
    const animal = animals.find(a => a.id === log.animal);
    return `${animal ? animal.unique_tag : 'N/A'} - ${log.log_date} - ${log.diagnosis}`;
  };

  const getMedicationName = (medicationId: number | null) => {
    if (medicationId === null) return 'N/A';
    const medication = medications.find(m => m.id === medicationId);
    return medication ? medication.name : 'N/A';
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8000/api/treatments/${id}/`)
      .then(() => {
        setTreatments(treatments.filter(treatment => treatment.id !== id));
      })
      .catch(err => {
        console.error('Error deleting treatment:', err);
        setError('Failed to delete treatment.');
      });
  };

  return (
    <div className="container mt-4">
      <h2>Treatments</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <Link to="/treatments/new" className="btn btn-primary mb-3">Add New Treatment</Link>
      {treatments.length === 0 && !error ? (
        <p>No treatments found.</p>
      ) : (
        <ul className="list-group">
          {treatments.map(treatment => (
            <li key={treatment.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                Health Log: {getHealthLogInfo(treatment.health_log)} - Medication: {getMedicationName(treatment.medication)} - Dosage: {treatment.dosage}
                {treatment.withdrawal_end_date && ` - Withdrawal End: ${treatment.withdrawal_end_date}`}
              </div>
              <div>
                <Link to={`/treatments/edit/${treatment.id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                <button onClick={() => handleDelete(treatment.id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TreatmentList;