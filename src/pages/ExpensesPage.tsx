import { useEffect, useState } from 'react';
import { getExpenses, createExpense, deleteExpense, getCategories } from '../api/expenses';
import { type Expense, type User } from '../types';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [paidBy, setPaidBy] = useState<User>('Laurens');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => getExpenses().then(data => { setExpenses(data); setLoading(false); });

  useEffect(() => {
    getCategories().then(cats => {
      setCategories(cats);
      if (cats.length > 0) setCategory(cats[0]);
    });
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !price) return;
    setSubmitting(true);
    await createExpense({ description, price: parseFloat(price), paidBy, category });
    setDescription('');
    setPrice('');
    await load();
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
    setExpenses(prev => prev.filter(e => e._id !== id));
  };

  return (
    <div className="page">
      <h1>Expenses</h1>

      <form className="expense-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price (€)"
          value={price}
          onChange={e => setPrice(e.target.value)}
          min="0"
          step="0.01"
          required
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={paidBy} onChange={e => setPaidBy(e.target.value as User)}>
          <option value="Laurens">Laurens</option>
          <option value="Julia">Julia</option>
        </select>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Expense'}
        </button>
      </form>

      {loading ? <p>Loading...</p> : (
        <table className="expense-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Paid by</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense._id}>
                <td>{expense.description}</td>
                <td><span className="badge category">{expense.category ?? 'Other'}</span></td>
                <td>€{expense.price.toFixed(2)}</td>
                <td>
                  <span className={`badge ${expense.paidBy.toLowerCase()}`}>
                    {expense.paidBy}
                  </span>
                </td>
                <td>{new Date(expense.createdAt).toLocaleDateString('nl-BE')}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(expense._id)}>✕</button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>No expenses yet</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
