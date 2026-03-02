import { HashRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ExpensesPage from './pages/ExpensesPage';

function App() {
  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
