import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface FinancialTransaction {
  id?: number;
  transaction_date: string;
  type: string;
  amount: number;
  description: string;
  related_entity_id: number | null;
}

function FinancialTransactionForm() {
  const [transactionDate, setTransactionDate] = useState('');
  const [type, setType] = useState('Costo');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [relatedEntityId, setRelatedEntityId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/financialtransactions/${id}/`)
        .then(response => {
          setTransactionDate(response.data.transaction_date);
          setType(response.data.type);
          setAmount(response.data.amount);
          setDescription(response.data.description);
          setRelatedEntityId(response.data.related_entity_id);
        })
        .catch(error => {
          console.error('Error fetching financial transaction:', error);
          setError('Failed to load financial transaction for editing.');
        });
    }
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const financialTransactionData: FinancialTransaction = {
      transaction_date: transactionDate,
      type,
      amount,
      description,
      related_entity_id: relatedEntityId,
    };

    if (id) {
      // Update existing financial transaction
      axios.put(`http://localhost:8000/api/financialtransactions/${id}/`, financialTransactionData)
        .then(() => {
          navigate('/financialtransactions');
        })
        .catch(error => {
          console.error('Error updating financial transaction:', error);
          setError('Failed to update financial transaction.');
        });
    } else {
      // Create new financial transaction
      axios.post('http://localhost:8000/api/financialtransactions/', financialTransactionData)
        .then(() => {
          navigate('/financialtransactions');
        })
        .catch(error => {
          console.error('Error creating financial transaction:', error);
          setError('Failed to create financial transaction.');
        });
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Financial Transaction' : 'Add New Financial Transaction'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="transactionDate">Transaction Date:</label>
          <input
            type="date"
            id="transactionDate"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Costo">Costo</option>
            <option value="Ingreso">Ingreso</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="relatedEntityId">Related Entity ID (Optional):</label>
          <input
            type="number"
            id="relatedEntityId"
            value={relatedEntityId || ''}
            onChange={(e) => setRelatedEntityId(e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>
        <button type="submit">{id ? 'Update Transaction' : 'Add Transaction'}</button>
      </form>
      <button onClick={() => navigate('/financialtransactions')}>Cancel</button>
    </div>
  );
}

export default FinancialTransactionForm;
