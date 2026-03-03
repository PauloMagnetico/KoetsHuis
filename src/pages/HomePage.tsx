import { useEffect, useState } from 'react';
import { getExpenses } from '../api/expenses';
import type { Expense } from '../types';

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExpenses().then(data => { setExpenses(data); setLoading(false); });
  }, []);

  const total = expenses.reduce((sum, e) => sum + e.price, 0);
  const laurensTotal = expenses.filter(e => e.paidBy === 'Laurens').reduce((sum, e) => sum + e.price, 0);
  const juliaTotal = expenses.filter(e => e.paidBy === 'Julia').reduce((sum, e) => sum + e.price, 0);
  const balance = laurensTotal - juliaTotal;

  const fmt = (n: number) => `€${n.toFixed(2)}`;

  return (
    <div className="page">
      <h1>KoetsHuis Renovatie</h1>
      <p className="subtitle">Expense overview for the renovation project</p>

      {loading ? <p>Loading...</p> : (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Spent</span>
            <span className="stat-value">{fmt(total)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Laurens Paid</span>
            <span className="stat-value laurens">{fmt(laurensTotal)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Julia Paid</span>
            <span className="stat-value julia">{fmt(juliaTotal)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Balance</span>
            <span className={`stat-value ${balance > 0 ? 'laurens' : balance < 0 ? 'julia' : ''}`}>
              {balance === 0
                ? 'Even'
                : balance > 0
                  ? `Julia owes Laurens ${fmt(Math.abs(balance) / 2)}`
                  : `Laurens owes Julia ${fmt(Math.abs(balance) / 2)}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
