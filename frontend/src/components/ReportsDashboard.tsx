import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

interface ProfitAndLossReport {
  total_income: number;
  total_cost: number;
  profit_loss: number;
}

interface BatchProfitabilityReport {
  message: string;
  example_batch_id?: number;
  example_profit?: number;
}

interface GDPReport {
  animal_id: number;
  animal_tag: string;
  initial_weight_kg: number;
  final_weight_kg: number;
  num_days: number;
  gdp: number;
}

interface Animal {
  id: number;
  unique_tag: string;
}

function ReportsDashboard() {
  const [icaReport, setIcaReport] = useState<ICAReport | null>(null);
  const [costReport, setCostReport] = useState<CostPerKgGainedReport | null>(null);
  const [profitAndLossReport, setProfitAndLossReport] = useState<ProfitAndLossReport | null>(null);
  const [batchProfitabilityReport, setBatchProfitabilityReport] = useState<BatchProfitabilityReport | null>(null);
  const [gdpReport, setGdpReport] = useState<GDPReport | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]); // For animal selection in GDP report
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [gdpAnimalId, setGdpAnimalId] = useState<number | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setError(null);
      const params = {
        start_date: startDate,
        end_date: endDate,
      };

      try {
        const icaRes = await axios.get('http://localhost:8000/api/reports/ica-report/', { params });
        setIcaReport(icaRes.data);

        const costRes = await axios.get('http://localhost:8000/api/reports/cost-per-kg-gained-report/', { params });
        setCostReport(costRes.data);

        const profitLossRes = await axios.get('http://localhost:8000/api/reports/profit-and-loss-report/');
        setProfitAndLossReport(profitLossRes.data);

        const batchProfitRes = await axios.get('http://localhost:8000/api/reports/batch-profitability-report/');
        setBatchProfitabilityReport(batchProfitRes.data);

        // Fetch animals for GDP report dropdown
        const animalsRes = await axios.get('http://localhost:8000/api/animals/');
        setAnimals(animalsRes.data);

        // Fetch GDP report if animal is selected
        if (gdpAnimalId) {
          const gdpParams = {
            animal_id: gdpAnimalId,
            start_date: startDate,
            end_date: endDate,
          };
          const gdpRes = await axios.get('http://localhost:8000/api/reports/gdp-report/', { params: gdpParams });
          setGdpReport(gdpRes.data);
        }

      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please check the backend API and ensure data exists.');
      }
    };
    fetchReports();
  }, [startDate, endDate, gdpAnimalId]); // Re-fetch reports when dates or GDP animal change

  const icaChartData = {
    labels: ['ICA'],
    datasets: [
      {
        label: 'ICA Value',
        data: [icaReport?.ica || 0],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const costChartData = {
    labels: ['Cost Per Kg Gained'],
    datasets: [
      {
        label: 'Cost Value',
        data: [costReport?.cost_per_kg_gained || 0],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Report Data',
      },
    },
  };

  return (
    <div className="container mt-4">
      <h2>Reports Dashboard</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="mb-3">
        <label htmlFor="startDate" className="form-label">Start Date:</label>
        <input
          type="date"
          id="startDate"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="endDate" className="form-label">End Date:</label>
        <input
          type="date"
          id="endDate"
          className="form-control"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header"><h3>ICA Report</h3></div>
            <div className="card-body">
              {icaReport ? (
                <div>
                  <p>Total Feed Consumed: {icaReport.total_feed_consumed_kg} kg</p>
                  <p>Total Weight Gained: {icaReport.total_weight_gained_kg} kg</p>
                  <p>ICA (Feed Conversion Ratio): {icaReport.ica}</p>
                  <div style={{ width: '100%', height: '200px' }}>
                    <Line data={icaChartData} options={chartOptions} />
                  </div>
                </div>
              ) : (
                <p>Loading ICA Report...</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header"><h3>Cost Per Kg Gained Report</h3></div>
            <div className="card-body">
              {costReport ? (
                <div>
                  <p>Total Feed Cost: ${costReport.total_feed_cost}</p>
                  <p>Total Weight Gained: {costReport.total_weight_gained_kg} kg</p>
                  <p>Cost Per Kg Gained: ${costReport.cost_per_kg_gained}</p>
                  <div style={{ width: '100%', height: '200px' }}>
                    <Line data={costChartData} options={chartOptions} />
                  </div>
                </div>
              ) : (
                <p>Loading Cost Per Kg Gained Report...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header"><h3>Profit and Loss Report</h3></div>
            <div className="card-body">
              {profitAndLossReport ? (
                <div>
                  <p>Total Income: ${profitAndLossReport.total_income}</p>
                  <p>Total Cost: ${profitAndLossReport.total_cost}</p>
                  <p>Profit/Loss: ${profitAndLossReport.profit_loss}</p>
                </div>
              ) : (
                <p>Loading Profit and Loss Report...</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header"><h3>Batch Profitability Report</h3></div>
            <div className="card-body">
              {batchProfitabilityReport ? (
                <div>
                  <p>{batchProfitabilityReport.message}</p>
                  {batchProfitabilityReport.example_batch_id && <p>Example Batch ID: {batchProfitabilityReport.example_batch_id}</p>}
                  {batchProfitabilityReport.example_profit && <p>Example Profit: ${batchProfitabilityReport.example_profit}</p>}
                </div>
              ) : (
                <p>Loading Batch Profitability Report...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card mb-3">
            <div className="card-header"><h3>GDP Report (Growth Daily Performance)</h3></div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="gdpAnimal" className="form-label">Select Animal:</label>
                <select
                  id="gdpAnimal"
                  className="form-select"
                  value={gdpAnimalId || ''}
                  onChange={(e) => setGdpAnimalId(e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">-- Select Animal --</option>
                  {animals.map(animal => (
                    <option key={animal.id} value={animal.id}>{animal.unique_tag}</option>
                  ))}
                </select>
              </div>
              {gdpReport ? (
                <div>
                  <p>Animal: {gdpReport.animal_tag}</p>
                  <p>Initial Weight: {gdpReport.initial_weight_kg} kg</p>
                  <p>Final Weight: {gdpReport.final_weight_kg} kg</p>
                  <p>Number of Days: {gdpReport.num_days}</p>
                  <p>GDP: {gdpReport.gdp} kg/day</p>
                </div>
              ) : (
                <p>Select an animal and date range to view GDP.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsDashboard;