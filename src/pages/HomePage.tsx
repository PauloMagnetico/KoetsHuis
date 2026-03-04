import { useEffect, useState } from 'react';
import { getExpenses } from '../api/expenses';
import { getEstimates } from '../api/estimates';
import { getInvoices } from '../api/invoices';
import type { Expense, Estimate, Invoice } from '../types';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';

const COLORS = [
  '#4f86c6', '#e8863a', '#52b788', '#e63946', '#a8dadc',
  '#457b9d', '#f4a261', '#2d6a4f', '#c77dff',
];

const fmt = (n: number) => `€${n.toFixed(2)}`;

function sumBy(items: { price: number; category: string }[], cat: string) {
  return items.filter(i => (i.category ?? 'Other') === cat).reduce((s, i) => s + i.price, 0);
}

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getExpenses(), getEstimates(), getInvoices()]).then(([exp, est, inv]) => {
      setExpenses(exp);
      setEstimates(est);
      setInvoices(inv);
      setLoading(false);
    });
  }, []);

  const total = expenses.reduce((s, e) => s + e.price, 0);
  const laurensTotal = expenses.filter(e => e.paidBy === 'Laurens').reduce((s, e) => s + e.price, 0);
  const juliaTotal = expenses.filter(e => e.paidBy === 'Julia').reduce((s, e) => s + e.price, 0);
  const balance = laurensTotal - juliaTotal;
  const estimateTotal = estimates.reduce((s, e) => s + e.price, 0);
  const invoiceTotal = invoices.reduce((s, i) => s + i.price, 0);

  const allCategories = [...new Set([
    ...expenses.map(e => e.category ?? 'Other'),
    ...estimates.map(e => e.category ?? 'Other'),
    ...invoices.map(i => i.category ?? 'Other'),
  ])];

  const comparisonData = allCategories.map(cat => ({
    name: cat,
    estimate: sumBy(estimates, cat),
    invoice: sumBy(invoices, cat),
    actual: sumBy(expenses, cat),
  })).filter(d => d.estimate > 0 || d.invoice > 0 || d.actual > 0);

  const expenseCategories = [...new Set(expenses.map(e => e.category ?? 'Other'))];
  const byCategory = expenseCategories.map((cat, i) => {
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

  const hasAnyData = expenses.length > 0 || estimates.length > 0 || invoices.length > 0;

  return (
    <div className="page">
      <h1>KoetsHuis Renovatie</h1>
      <p className="subtitle">Overview of the renovation project</p>

      {loading ? <p>Loading...</p> : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Estimated</span>
              <span className="stat-value">{fmt(estimateTotal)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Quoted</span>
              <span className="stat-value">{fmt(invoiceTotal)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Spent</span>
              <span className="stat-value">{fmt(total)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Balance</span>
              <span className={`stat-value ${balance > 0 ? 'laurens' : balance < 0 ? 'julia' : ''}`}>
                {balance === 0
                  ? 'Even'
                  : balance > 0
                    ? `Julia owes ${fmt(Math.abs(balance) / 2)}`
                    : `Laurens owes ${fmt(Math.abs(balance) / 2)}`}
              </span>
            </div>
          </div>

          {!hasAnyData ? (
            <p style={{ color: '#888', marginTop: '2rem' }}>No data yet — add estimates, invoices or expenses to see charts.</p>
          ) : (
            <>
              {comparisonData.length > 0 && (
                <div className="chart-card" style={{ marginBottom: '1.5rem' }}>
                  <h2>Estimate vs Invoice vs Actual per Category</h2>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={comparisonData} margin={{ top: 5, right: 10, left: 10, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 12 }} />
                      <YAxis tickFormatter={(v) => `€${v}`} tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" />
                      <Bar dataKey="estimate" name="Estimate" fill="#a8dadc" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="invoice" name="Invoice" fill="#e8863a" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="actual" name="Actual" fill="#2563eb" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {expenses.length > 0 && (
                <>
                  <div className="charts-grid">
                    <div className="chart-card">
                      <h2>Expenses by Category</h2>
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                            {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                          <Tooltip formatter={(v) => fmt(v as number)} />
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
                        <th>Actual</th>
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
            </>
          )}
        </>
      )}
    </div>
  );
}
