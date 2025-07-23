import { useState, useEffect } from 'react';
import axios from 'axios';

interface ICAReport {
  total_feed_consumed_kg: number;
  total_weight_gained_kg: number;
  ica: number;
}

interface CostPerKgGainedReport {
  total_feed_cost: number;
  total_weight_gained_kg: number;
  cost_per_kg_gained: number;
}

function ReportsDashboard() {
  const [icaReport, setIcaReport] = useState<ICAReport | null>(null);
  const [costReport, setCostReport] = useState<CostPerKgGainedReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const icaRes = await axios.get('http://localhost:8000/api/reports/ica-report/');
        setIcaReport(icaRes.data);

        const costRes = await axios.get('http://localhost:8000/api/reports/cost-per-kg-gained-report/');
        setCostReport(costRes.data);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please check the backend API and ensure data exists.');
      }
    };
    fetchReports();
  }, []);

  return (
    <div>
      <h2>Reports Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>ICA Report</h3>
      {icaReport ? (
        <div>
          <p>Total Feed Consumed: {icaReport.total_feed_consumed_kg} kg</p>
          <p>Total Weight Gained: {icaReport.total_weight_gained_kg} kg</p>
          <p>ICA (Feed Conversion Ratio): {icaReport.ica}</p>
        </div>
      ) : (
        <p>Loading ICA Report...</p>
      )}

      <h3>Cost Per Kg Gained Report</h3>
      {costReport ? (
        <div>
          <p>Total Feed Cost: ${costReport.total_feed_cost}</p>
          <p>Total Weight Gained: {costReport.total_weight_gained_kg} kg</p>
          <p>Cost Per Kg Gained: ${costReport.cost_per_kg_gained}</p>
        </div>
      ) : (
        <p>Loading Cost Per Kg Gained Report...</p>
      )}
    </div>
  );
}

export default ReportsDashboard;
