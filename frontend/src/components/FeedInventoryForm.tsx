import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface FeedInventory {
  id?: number;
  product_name: string;
  quantity_kg: number;
  cost_per_kg: number;
  supplier: string | null;
}

function FeedInventoryForm() {
  const [productName, setProductName] = useState('');
  const [quantityKg, setQuantityKg] = useState(0);
  const [costPerKg, setCostPerKg] = useState(0);
  const [supplier, setSupplier] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/feedinventory/${id}/`)
        .then(response => {
          setProductName(response.data.product_name);
          setQuantityKg(response.data.quantity_kg);
          setCostPerKg(response.data.cost_per_kg);
          setSupplier(response.data.supplier);
        })
        .catch(error => {
          console.error('Error fetching feed inventory item:', error);
          setError('Failed to load feed inventory item for editing.');
        });
    }
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const feedInventoryData: FeedInventory = {
      product_name: productName,
      quantity_kg: quantityKg,
      cost_per_kg: costPerKg,
      supplier,
    };

    if (id) {
      // Update existing feed inventory item
      axios.put(`http://localhost:8000/api/feedinventory/${id}/`, feedInventoryData)
        .then(() => {
          navigate('/feedinventory');
        })
        .catch(error => {
          console.error('Error updating feed inventory item:', error);
          setError('Failed to update feed inventory item.');
        });
    } else {
      // Create new feed inventory item
      axios.post('http://localhost:8000/api/feedinventory/', feedInventoryData)
        .then(() => {
          navigate('/feedinventory');
        })
        .catch(error => {
          console.error('Error creating feed inventory item:', error);
          setError('Failed to create feed inventory item.');
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Edit Feed Inventory Item' : 'Add New Feed Inventory Item'}</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">Product Name:</label>
          <input
            type="text"
            id="productName"
            className="form-control"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantityKg" className="form-label">Quantity (kg):</label>
          <input
            type="number"
            id="quantityKg"
            step="0.01"
            className="form-control"
            value={quantityKg}
            onChange={(e) => setQuantityKg(parseFloat(e.target.value))}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="costPerKg" className="form-label">Cost Per Kg:</label>
          <input
            type="number"
            id="costPerKg"
            step="0.01"
            className="form-control"
            value={costPerKg}
            onChange={(e) => setCostPerKg(parseFloat(e.target.value))}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="supplier" className="form-label">Supplier:</label>
          <input
            type="text"
            id="supplier"
            className="form-control"
            value={supplier || ''}
            onChange={(e) => setSupplier(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">{id ? 'Update Item' : 'Add Item'}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/feedinventory')}>Cancel</button>
      </form>
    </div>
  );
}

export default FeedInventoryForm;