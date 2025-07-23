import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface FeedRation {
  id: number;
  name: string;
  description: string;
  components: RationComponent[];
}

interface RationComponent {
  id: number;
  feed_item_name: string;
  percentage: number;
}

function FeedRationList() {
  const [feedRations, setFeedRations] = useState<FeedRation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/feedrations/')
      .then(response => {
        setFeedRations(response.data);
      })
      .catch(error => {
        console.error('Error fetching feed rations:', error);
        setError('Failed to load feed rations. Please check the backend API.');
      });
  }, []);

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8000/api/feedrations/${id}/`)
      .then(() => {
        setFeedRations(feedRations.filter(ration => ration.id !== id));
      })
      .catch(error => {
        console.error('Error deleting feed ration:', error);
        setError('Failed to delete feed ration.');
      });
  };

  return (
    <div className="container mt-4">
      <h2>Feed Rations</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <Link to="/feedrations/new" className="btn btn-primary mb-3">Add New Feed Ration</Link>
      {feedRations.length === 0 && !error ? (
        <p>No feed rations found.</p>
      ) : (
        <ul className="list-group">
          {feedRations.map(ration => (
            <li key={ration.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {ration.name} - {ration.description}
                {ration.components.length > 0 && (
                  <ul className="list-group mt-2">
                    {ration.components.map(component => (
                      <li key={component.id} className="list-group-item list-group-item-secondary">
                        {component.feed_item_name}: {component.percentage}%
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <Link to={`/feedrations/edit/${ration.id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                <button onClick={() => handleDelete(ration.id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FeedRationList;
