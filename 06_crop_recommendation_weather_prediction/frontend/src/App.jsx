import "./App.css";
import Dashboard from "./components/Dashboard.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
