import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface FeedInventory {
  id: number;
  product_name: string;
  quantity_kg: number;
  cost_per_kg: number;
  supplier: string | null;
  entry_date: string;
}

function FeedInventoryList() {
  const [feedInventory, setFeedInventory] = useState<FeedInventory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/feedinventory/')
      .then(response => {
        setFeedInventory(response.data);
      })
      .catch(error => {
        console.error('Error fetching feed inventory:', error);
        setError('Failed to load feed inventory. Please check the backend API.');
      });
  }, []);

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8000/api/feedinventory/${id}/`)
      .then(() => {
        setFeedInventory(feedInventory.filter(item => item.id !== id));
      })
      .catch(error => {
        console.error('Error deleting feed inventory item:', error);
        setError('Failed to delete feed inventory item.');
      });
  };

  return (
    <div className="container mt-4">
      <h2>Feed Inventory</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <Link to="/feedinventory/new" className="btn btn-primary mb-3">Add New Feed Item</Link>
      {feedInventory.length === 0 && !error ? (
        <p>No feed inventory items found.</p>
      ) : (
        <ul className="list-group">
          {feedInventory.map(item => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {item.product_name} - {item.quantity_kg} kg - ${item.cost_per_kg}/kg
                {item.supplier && ` (Supplier: ${item.supplier})`}
              </div>
              <div>
                <Link to={`/feedinventory/edit/${item.id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FeedInventoryList;
