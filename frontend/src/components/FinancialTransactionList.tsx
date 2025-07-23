import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface FinancialTransaction {
  id: number;
  transaction_date: string;
  type: string;
  amount: number;
  description: string;
  related_entity_id: number | null;
}

function FinancialTransactionList() {
  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/financialtransactions/')
      .then(response => {
        setFinancialTransactions(response.data);
      })
      .catch(error => {
        console.error('Error fetching financial transactions:', error);
        setError('Failed to load financial transactions. Please check the backend API.');
      });
  }, []);

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8000/api/financialtransactions/${id}/`)
      .then(() => {
        setFinancialTransactions(financialTransactions.filter(transaction => transaction.id !== id));
      })
      .catch(error => {
        console.error('Error deleting financial transaction:', error);
        setError('Failed to delete financial transaction.');
      });
  };

  return (
    <div>
      <h2>Financial Transactions</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Link to="/financialtransactions/new">Add New Transaction</Link>
      {financialTransactions.length === 0 && !error ? (
        <p>No financial transactions found.</p>
      ) : (
        <ul>
          {financialTransactions.map(transaction => (
            <li key={transaction.id}>
              {transaction.transaction_date} - {transaction.type}: {transaction.amount} - {transaction.description}
              {transaction.related_entity_id && ` (Related Entity ID: ${transaction.related_entity_id})`}
              <Link to={`/financialtransactions/edit/${transaction.id}`}>Edit</Link>
              <button onClick={() => handleDelete(transaction.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FinancialTransactionList;
