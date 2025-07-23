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

interface FertilityRateReport {
  total_females_breeding: number;
  total_females_pregnant: number;
  fertility_rate: number;
}

interface ParturitionRateReport {
  total_females_gave_birth: number;
  total_females_pregnant: number;
  parturition_rate: number;
}

interface ProlificacyReport {
  total_live_births: number;
  total_reproduction_events_with_birth: number;
  prolificacy: number;
}

interface WPIReport {
  message: string;
  wpi: number;
}

interface WithdrawalAlert {
  animal_id: number;
  animal_tag: string;
  medication: string;
  withdrawal_end_date: string;
  message: string;
}

interface IneffectiveTreatmentAlert {
  animal_id: number;
  animal_tag: string;
  diagnosis: string;
  treatment_count: number;
  message: string;
}

interface LowStockAlert {
  product_name: string;
  current_stock_kg: number;
  threshold_kg: number;
  message: string;
}

interface Animal {
  id: number;
  unique_tag: string;
  sex: string;
  is_breeding_ready: boolean;
}

function ReportsDashboard() {
  const [icaReport, setIcaReport] = useState<ICAReport | null>(null);
  const [costReport, setCostReport] = useState<CostPerKgGainedReport | null>(null);
  const [profitAndLossReport, setProfitAndLossReport] = useState<ProfitAndLossReport | null>(null);
  const [batchProfitabilityReport, setBatchProfitabilityReport] = useState<BatchProfitabilityReport | null>(null);
  const [gdpReport, setGdpReport] = useState<GDPReport | null>(null);
  const [fertilityRateReport, setFertilityRateReport] = useState<FertilityRateReport | null>(null);
  const [parturitionRateReport, setParturitionRateReport] = useState<ParturitionRateReport | null>(null);
  const [prolificacyReport, setProlificacyReport] = useState<ProlificacyReport | null>(null);
  const [wpiReport, setWpiReport] = useState<WPIReport | null>(null);
  const [withdrawalAlerts, setWithdrawalAlerts] = useState<WithdrawalAlert[]>([]);
  const [ineffectiveTreatmentAlerts, setIneffectiveTreatmentAlerts] = useState<IneffectiveTreatmentAlert[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]); // For animal selection in GDP report
  const [breedingReadyAnimals, setBreedingReadyAnimals] = useState<Animal[]>([]);
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

        const fertilityRes = await axios.get('http://localhost:8000/api/reports/fertility-rate-report/');
        setFertilityRateReport(fertilityRes.data);

        const parturitionRes = await axios.get('http://localhost:8000/api/reports/parturition-rate-report/');
        setParturitionRateReport(parturitionRes.data);

        const prolificacyRes = await axios.get('http://localhost:8000/api/reports/prolificacy-report/');
        setProlificacyReport(prolificacyRes.data);

        const wpiRes = await axios.get('http://localhost:8000/api/reports/wpi-report/');
        setWpiReport(wpiRes.data);

        const withdrawalRes = await axios.get('http://localhost:8000/api/reports/withdrawal-alerts/');
        setWithdrawalAlerts(withdrawalRes.data);

        const ineffectiveRes = await axios.get('http://localhost:8000/api/reports/ineffective-treatment-alerts/');
        setIneffectiveTreatmentAlerts(ineffectiveRes.data);

        const lowStockRes = await axios.get('http://localhost:8000/api/reports/low-stock-alerts/');
        setLowStockAlerts(lowStockRes.data);

        // Fetch animals for GDP report dropdown and breeding ready animals
        const animalsRes = await axios.get('http://localhost:8000/api/animals/');
        setAnimals(animalsRes.data);
        setBreedingReadyAnimals(animalsRes.data.filter((animal: Animal) => animal.is_breeding_ready));

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

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header"><h3>Fertility Rate Report</h3></div>
            <div className="card-body">
              {fertilityRateReport ? (
                <div>
                  <p>Total Females for Breeding: {fertilityRateReport.total_females_breeding}</p>
                  <p>Total Pregnant Females: {fertilityRateReport.total_females_pregnant}</p>
                  <p>Fertility Rate: {fertilityRateReport.fertility_rate}%</p>
                </div>
              ) : (
                <p>Loading Fertility Rate Report...</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header"><h3>Parturition Rate Report</h3></div>
            <div className="card-body">
              {parturitionRateReport ? (
                <div>
                  <p>Total Females Gave Birth: {parturitionRateReport.total_females_gave_birth}</p>
                  <p>Total Pregnant Females (Simplified): {parturitionRateReport.total_females_pregnant}</p>
                  <p>Parturition Rate: {parturitionRateReport.parturition_rate}%</p>
                </div>
              ) : (
                <p>Loading Parturition Rate Report...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header"><h3>Prolificacy Report</h3></div>
            <div className="card-body">
              {prolificacyReport ? (
                <div>
                  <p>Total Live Births: {prolificacyReport.total_live_births}</p>
                  <p>Total Reproduction Events with Birth: {prolificacyReport.total_reproduction_events_with_birth}</p>
                  <p>Prolificacy: {prolificacyReport.prolificacy}</p>
                </div>
              ) : (
                <p>Loading Prolificacy Report...</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header"><h3>WPI Report (Weaning Productive Index)</h3></div>
            <div className="card-body">
              {wpiReport ? (
                <div>
                  <p>{wpiReport.message}</p>
                  <p>WPI: {wpiReport.wpi}</p>
                </div>
              ) : (
                <p>Loading WPI Report...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card mb-3">
            <div className="card-header"><h3>Health Alerts</h3></div>
            <div className="card-body">
              <h4>Withdrawal Period Alerts</h4>
              {withdrawalAlerts.length > 0 ? (
                <ul className="list-group mb-3">
                  {withdrawalAlerts.map((alert, index) => (
                    <li key={index} className="list-group-item alert-warning">
                      {alert.message} (Animal ID: {alert.animal_id}, Medication: {alert.medication}, End Date: {alert.withdrawal_end_date})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No withdrawal period alerts.</p>
              )}

              <h4>Ineffective Treatment Alerts</h4>
              {ineffectiveTreatmentAlerts.length > 0 ? (
                <ul className="list-group">
                  {ineffectiveTreatmentAlerts.map((alert, index) => (
                    <li key={index} className="list-group-item alert-danger">
                      {alert.message} (Animal ID: {alert.animal_id}, Diagnosis: {alert.diagnosis}, Treatments: {alert.treatment_count})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No ineffective treatment alerts.</p>
              )}

              <h4>Low Stock Alerts</h4>
              {lowStockAlerts.length > 0 ? (
                <ul className="list-group">
                  {lowStockAlerts.map((alert, index) => (
                    <li key={index} className="list-group-item alert-danger">
                      {alert.message} (Product: {alert.product_name}, Current Stock: {alert.current_stock_kg} kg)
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No low stock alerts.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsDashboard;
