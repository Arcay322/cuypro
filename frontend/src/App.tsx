import { Routes, Route, Link } from 'react-router-dom';
import LineList from './components/LineList';
import LineForm from './components/LineForm';
import LocationList from './components/LocationList';
import LocationForm from './components/LocationForm';
import AnimalList from './components/AnimalList';
import AnimalForm from './components/AnimalForm';
import WeightLogList from './components/WeightLogList';
import WeightLogForm from './components/WeightLogForm';
import ReproductionEventList from './components/ReproductionEventList';
import ReproductionEventForm from './components/ReproductionEventForm';
import MedicationList from './components/MedicationList';
import MedicationForm from './components/MedicationForm';
import HealthLogList from './components/HealthLogList';
import HealthLogForm from './components/HealthLogForm';
import TreatmentList from './components/TreatmentList';
import TreatmentForm from './components/TreatmentForm';
import FinancialTransactionList from './components/FinancialTransactionList';
import FinancialTransactionForm from './components/FinancialTransactionForm';
import FeedingLogList from './components/FeedingLogList';
import FeedingLogForm from './components/FeedingLogForm';
import ReportsDashboard from './components/ReportsDashboard';

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/lines">Manage Lines</Link>
          </li>
          <li>
            <Link to="/locations">Manage Locations</Link>
          </li>
          <li>
            <Link to="/animals">Manage Animals</Link>
          </li>
          <li>
            <Link to="/weightlogs">Manage Weight Logs</Link>
          </li>
          <li>
            <Link to="/reproductionevents">Manage Reproduction Events</Link>
          </li>
          <li>
            <Link to="/medications">Manage Medications</Link>
          </li>
          <li>
            <Link to="/healthlogs">Manage Health Logs</Link>
          </li>
          <li>
            <Link to="/treatments">Manage Treatments</Link>
          </li>
          <li>
            <Link to="/financialtransactions">Manage Financial Transactions</Link>
          </li>
          <li>
            <Link to="/feedinglogs">Manage Feeding Logs</Link>
          </li>
          <li>
            <Link to="/reports">Reports Dashboard</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/lines" element={<LineList />} />
        <Route path="/lines/new" element={<LineForm />} />
        <Route path="/lines/edit/:id" element={<LineForm />} />
        <Route path="/locations" element={<LocationList />} />
        <Route path="/locations/new" element={<LocationForm />} />
        <Route path="/locations/edit/:id" element={<LocationForm />} />
        <Route path="/animals" element={<AnimalList />} />
        <Route path="/animals/new" element={<AnimalForm />} />
        <Route path="/animals/edit/:id" element={<AnimalForm />} />
        <Route path="/weightlogs" element={<WeightLogList />} />
        <Route path="/weightlogs/new" element={<WeightLogForm />} />
        <Route path="/weightlogs/edit/:id" element={<WeightLogForm />} />
        <Route path="/reproductionevents" element={<ReproductionEventList />} />
        <Route path="/reproductionevents/new" element={<ReproductionEventForm />} />
        <Route path="/reproductionevents/edit/:id" element={<ReproductionEventForm />} />
        <Route path="/medications" element={<MedicationList />} />
        <Route path="/medications/new" element={<MedicationForm />} />
        <Route path="/medications/edit/:id" element={<MedicationForm />} />
        <Route path="/healthlogs" element={<HealthLogList />} />
        <Route path="/healthlogs/new" element={<HealthLogForm />} />
        <Route path="/healthlogs/edit/:id" element={<HealthLogForm />} />
        <Route path="/treatments" element={<TreatmentList />} />
        <Route path="/treatments/new" element={<TreatmentForm />} />
        <Route path="/treatments/edit/:id" element={<TreatmentForm />} />
        <Route path="/financialtransactions" element={<FinancialTransactionList />} />
        <Route path="/financialtransactions/new" element={<FinancialTransactionForm />} />
        <Route path="/financialtransactions/edit/:id" element={<FinancialTransactionForm />} />
        <Route path="/feedinglogs" element={<FeedingLogList />} />
        <Route path="/feedinglogs/new" element={<FeedingLogForm />} />
        <Route path="/feedinglogs/edit/:id" element={<FeedingLogForm />} />
        <Route path="/reports" element={<ReportsDashboard />} />
        <Route path="/" element={<h1>Welcome to CuyPro!</h1>} />
      </Routes>
    </div>
  );
}

export default App;
