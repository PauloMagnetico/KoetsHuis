import { HashRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ExpensesPage from './pages/ExpensesPage';
import EstimatesPage from './pages/EstimatesPage';
import InvoicesPage from './pages/InvoicesPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import TaskBoardPage from './pages/TaskBoardPage';

function App() {
  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/estimates" element={<EstimatesPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/tasks" element={<TaskBoardPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
