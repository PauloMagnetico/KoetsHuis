import { HashRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ExpensesPage from './pages/ExpensesPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
