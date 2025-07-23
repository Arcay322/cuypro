import { Routes, Route, Link } from 'react-router-dom';
import LineList from './components/LineList';
import LineForm from './components/LineForm';
import LocationList from './components/LocationList';
import LocationForm from './components/LocationForm';
import AnimalList from './components/AnimalList';
import AnimalForm from './components/AnimalForm';

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
        <Route path="/" element={<h1>Welcome to CuyPro!</h1>} />
      </Routes>
    </div>
  );
}

export default App;
