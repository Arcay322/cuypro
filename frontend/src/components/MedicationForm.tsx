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
    <div>
      <h2>{id ? 'Edit Medication' : 'Add New Medication'}</h2>
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
          <label htmlFor="withdrawalPeriodDays">Withdrawal Period (Days):</label>
          <input
            type="number"
            id="withdrawalPeriodDays"
            value={withdrawalPeriodDays}
            onChange={(e) => setWithdrawalPeriodDays(parseInt(e.target.value))}
            required
          />
        </div>
        <button type="submit">{id ? 'Update Medication' : 'Add Medication'}</button>
      </form>
      <button onClick={() => navigate('/medications')}>Cancel</button>
    </div>
  );
}

export default MedicationForm;
