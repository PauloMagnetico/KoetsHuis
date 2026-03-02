import { useEffect, useState } from 'react';
import { getExpenses } from '../api/expenses';
import { Expense, CATEGORIES } from '../types';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const COLORS = [
  '#4f86c6', '#e8863a', '#52b788', '#e63946', '#a8dadc',
  '#457b9d', '#f4a261', '#2d6a4f', '#c77dff',
];

const fmt = (n: number) => `€${n.toFixed(2)}`;

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExpenses().then(data => { setExpenses(data); setLoading(false); });
  }, []);

  const byCategory = CATEGORIES.map((cat, i) => {
    const items = expenses.filter(e => (e.category ?? 'Other') === cat);
    const total = items.reduce((s, e) => s + e.price, 0);
    const laurens = items.filter(e => e.paidBy === 'Laurens').reduce((s, e) => s + e.price, 0);
    const julia = items.filter(e => e.paidBy === 'Julia').reduce((s, e) => s + e.price, 0);
    return { name: cat, total, laurens, julia, color: COLORS[i % COLORS.length] };
  }).filter(c => c.total > 0);

  const pieData = byCategory.map(c => ({ name: c.name, value: c.total, color: c.color }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="chart-tooltip">
        <strong>{payload[0].payload.name ?? payload[0].name}</strong>
        {payload.map((p: any) => (
          <div key={p.dataKey ?? p.name} style={{ color: p.fill ?? p.color }}>
            {p.name}: {fmt(p.value)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p className="subtitle">Spending breakdown by category</p>

      {loading ? <p>Loading...</p> : expenses.length === 0 ? (
        <p style={{ color: '#888', marginTop: '2rem' }}>No expenses yet — add some on the Expenses page.</p>
      ) : (
        <>
          <div className="charts-grid">
            <div className="chart-card">
              <h2>By Category</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h2>Laurens vs Julia per Category</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={byCategory} margin={{ top: 5, right: 10, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `€${v}`} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" />
                  <Bar dataKey="laurens" name="Laurens" fill="#2563eb" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="julia" name="Julia" fill="#db2777" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h2 style={{ margin: '2rem 0 1rem' }}>Category Breakdown</h2>
          <table className="expense-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Laurens</th>
                <th>Julia</th>
                <th>Total</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {byCategory.sort((a, b) => b.total - a.total).map(cat => {
                const grandTotal = expenses.reduce((s, e) => s + e.price, 0);
                return (
                  <tr key={cat.name}>
                    <td><span className="badge category">{cat.name}</span></td>
                    <td className="num laurens-text">€{cat.laurens.toFixed(2)}</td>
                    <td className="num julia-text">€{cat.julia.toFixed(2)}</td>
                    <td className="num"><strong>€{cat.total.toFixed(2)}</strong></td>
                    <td>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(cat.total / grandTotal) * 100}%`, background: cat.color }} />
                      </div>
                      <span className="progress-pct">{((cat.total / grandTotal) * 100).toFixed(1)}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
