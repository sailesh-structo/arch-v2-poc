import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Dashboard";
import History from "./History";

const TopNavigation = () => (
  <nav>
    <ul>
      <li>
        <Link to="/">Dashboard</Link>
      </li>
      <li>
        <Link to="/history">Job History</Link>
      </li>
    </ul>
  </nav>
);

function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <TopNavigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
