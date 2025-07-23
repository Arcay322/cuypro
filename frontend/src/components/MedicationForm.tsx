import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Medication {
  id?: number;
  name: string;
  withdrawal_period_days: number;
}

function MedicationForm() {
  const [name, setName] = useState('');
  const [withdrawalPeriodDays, setWithdrawalPeriodDays] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/medications/${id}/`)
        .then(response => {
          setName(response.data.name);
          setWithdrawalPeriodDays(response.data.withdrawal_period_days);
        })
        .catch(error => {
          console.error('Error fetching medication:', error);
          setError('Failed to load medication for editing.');
        });
    }
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const medicationData: Medication = {
      name,
      withdrawal_period_days: withdrawalPeriodDays,
    };

    if (id) {
      // Update existing medication
      axios.put(`http://localhost:8000/api/medications/${id}/`, medicationData)
        .then(() => {
          navigate('/medications');
        })
        .catch(error => {
          console.error('Error updating medication:', error);
          setError('Failed to update medication.');
        });
    } else {
      // Create new medication
      axios.post('http://localhost:8000/api/medications/', medicationData)
        .then(() => {
          navigate('/medications');
        })
        .catch(error => {
          console.error('Error creating medication:', error);
          setError('Failed to create medication.');
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Edit Medication' : 'Add New Medication'}</h2>
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
          <label htmlFor="withdrawalPeriodDays" className="form-label">Withdrawal Period (Days):</label>
          <input
            type="number"
            id="withdrawalPeriodDays"
            className="form-control"
            value={withdrawalPeriodDays}
            onChange={(e) => setWithdrawalPeriodDays(parseInt(e.target.value))}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">{id ? 'Update Medication' : 'Add Medication'}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/medications')}>Cancel</button>
      </form>
    </div>
  );
}

export default MedicationForm;