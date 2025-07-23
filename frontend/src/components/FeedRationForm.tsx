import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface FeedRation {
  id?: number;
  name: string;
  description: string;
  components?: RationComponent[];
}

interface RationComponent {
  id?: number;
  feed_ration?: number;
  feed_item: number;
  percentage: number;
}

interface FeedInventoryItem {
  id: number;
  product_name: string;
}

function FeedRationForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [components, setComponents] = useState<RationComponent[]>([]);
  const [feedInventoryItems, setFeedInventoryItems] = useState<FeedInventoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryRes = await axios.get('http://localhost:8000/api/feedinventory/');
        setFeedInventoryItems(inventoryRes.data);

        if (id) {
          const rationRes = await axios.get(`http://localhost:8000/api/feedrations/${id}/`);
          setName(rationRes.data.name);
          setDescription(rationRes.data.description);
          setComponents(rationRes.data.components.map((comp: any) => ({
            id: comp.id,
            feed_ration: comp.feed_ration,
            feed_item: comp.feed_item,
            percentage: comp.percentage,
          })));
        }
      } catch (err) {
        console.error('Error fetching data for feed ration form:', err);
        setError('Failed to load form data. Please check the backend API.');
      }
    };
    fetchData();
  }, [id]);

  const handleComponentChange = (index: number, field: string, value: any) => {
    const newComponents = [...components];
    (newComponents[index] as any)[field] = value;
    setComponents(newComponents);
  };

  const addComponent = () => {
    setComponents([...components, { feed_item: 0, percentage: 0 }]);
  };

  const removeComponent = (index: number) => {
    const newComponents = components.filter((_, i) => i !== index);
    setComponents(newComponents);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const totalPercentage = components.reduce((sum, comp) => sum + comp.percentage, 0);
    if (totalPercentage !== 100) {
      setError('Total percentage of components must be 100%.');
      return;
    }

    const feedRationData: FeedRation = {
      name,
      description,
    };

    try {
      let rationRes;
      if (id) {
        rationRes = await axios.put(`http://localhost:8000/api/feedrations/${id}/`, feedRationData);
      } else {
        rationRes = await axios.post('http://localhost:8000/api/feedrations/', feedRationData);
      }

      const rationId = rationRes.data.id;

      // Handle components: delete existing, then create new ones
      if (id) {
        const existingComponentsRes = await axios.get(`http://localhost:8000/api/rationcomponents/?feed_ration=${id}`);
        for (const comp of existingComponentsRes.data) {
          await axios.delete(`http://localhost:8000/api/rationcomponents/${comp.id}/`);
        }
      }

      for (const comp of components) {
        await axios.post('http://localhost:8000/api/rationcomponents/', {
          feed_ration: rationId,
          feed_item: comp.feed_item,
          percentage: comp.percentage,
        });
      }

      navigate('/feedrations');
    } catch (err) {
      console.error('Error saving feed ration:', err);
      setError('Failed to save feed ration. Please check your input and the backend API.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Edit Feed Ration' : 'Add New Feed Ration'}</h2>
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
          <label htmlFor="description" className="form-label">Description:</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <h3>Components</h3>
        {components.map((component, index) => (
          <div key={index} className="row mb-2 align-items-end">
            <div className="col-md-5">
              <label htmlFor={`feedItem-${index}`} className="form-label">Feed Item:</label>
              <select
                id={`feedItem-${index}`}
                className="form-select"
                value={component.feed_item}
                onChange={(e) => handleComponentChange(index, 'feed_item', parseInt(e.target.value))}
                required
              >
                <option value="">-- Select Feed Item --</option>
                {feedInventoryItems.map(item => (
                  <option key={item.id} value={item.id}>{item.product_name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-5">
              <label htmlFor={`percentage-${index}`} className="form-label">Percentage (%):</label>
              <input
                type="number"
                id={`percentage-${index}`}
                className="form-control"
                value={component.percentage}
                onChange={(e) => handleComponentChange(index, 'percentage', parseFloat(e.target.value))}
                required
                min="0"
                max="100"
              />
            </div>
            <div className="col-md-2">
              <button type="button" className="btn btn-danger" onClick={() => removeComponent(index)}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={addComponent}>Add Component</button>

        <div>
          <button type="submit" className="btn btn-primary">{id ? 'Update Ration' : 'Add Ration'}</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/feedrations')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default FeedRationForm;