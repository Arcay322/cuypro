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
    <div className="container mt-4">
      <h2>Medications</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <Link to="/medications/new" className="btn btn-primary mb-3">Add New Medication</Link>
      {medications.length === 0 && !error ? (
        <p>No medications found.</p>
      ) : (
        <ul className="list-group">
          {medications.map(medication => (
            <li key={medication.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {medication.name} - Withdrawal Period: {medication.withdrawal_period_days} days
              </div>
              <div>
                <Link to={`/medications/edit/${medication.id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                <button onClick={() => handleDelete(medication.id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MedicationList;