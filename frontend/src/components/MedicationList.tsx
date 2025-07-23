import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Medication {
  id: number;
  name: string;
  withdrawal_period_days: number;
}

function MedicationList() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/medications/')
      .then(response => {
        setMedications(response.data);
      })
      .catch(error => {
        console.error('Error fetching medications:', error);
        setError('Failed to load medications. Please check the backend API.');
      });
  }, []);

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8000/api/medications/${id}/`)
      .then(() => {
        setMedications(medications.filter(medication => medication.id !== id));
      })
      .catch(error => {
        console.error('Error deleting medication:', error);
        setError('Failed to delete medication.');
      });
  };

  return (
    <div>
      <h2>Medications</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Link to="/medications/new">Add New Medication</Link>
      {medications.length === 0 && !error ? (
        <p>No medications found.</p>
      ) : (
        <ul>
          {medications.map(medication => (
            <li key={medication.id}>
              {medication.name} - Withdrawal Period: {medication.withdrawal_period_days} days
              <Link to={`/medications/edit/${medication.id}`}>Edit</Link>
              <button onClick={() => handleDelete(medication.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MedicationList;
