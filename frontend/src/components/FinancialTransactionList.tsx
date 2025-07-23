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
    <div className="container mt-4">
      <h2>Financial Transactions</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <Link to="/financialtransactions/new" className="btn btn-primary mb-3">Add New Transaction</Link>
      {financialTransactions.length === 0 && !error ? (
        <p>No financial transactions found.</p>
      ) : (
        <ul className="list-group">
          {financialTransactions.map(transaction => (
            <li key={transaction.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {transaction.transaction_date} - {transaction.type}: {transaction.amount} - {transaction.description}
                {transaction.related_entity_id && ` (Related Entity ID: ${transaction.related_entity_id})`}
              </div>
              <div>
                <Link to={`/financialtransactions/edit/${transaction.id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                <button onClick={() => handleDelete(transaction.id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FinancialTransactionList;