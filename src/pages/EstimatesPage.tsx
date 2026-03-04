import { useEffect, useState } from 'react';
import { getEstimates, createEstimate, deleteEstimate } from '../api/estimates';
import { getCategories } from '../api/expenses';
import type { Estimate } from '../types';

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => getEstimates().then(data => { setEstimates(data); setLoading(false); });

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
    await createEstimate({ description, price: parseFloat(price), category });
    setDescription('');
    setPrice('');
    await load();
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await deleteEstimate(id);
    setEstimates(prev => prev.filter(e => e._id !== id));
  };

  const total = estimates.reduce((s, e) => s + e.price, 0);

  return (
    <div className="page">
      <h1>Estimates</h1>
      <p className="subtitle">Architect estimates per category</p>

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
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Estimate'}
        </button>
      </form>

      {loading ? <p>Loading...</p> : (
        <>
          <table className="expense-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {estimates.map(item => (
                <tr key={item._id}>
                  <td>{item.description}</td>
                  <td><span className="badge category">{item.category ?? 'Other'}</span></td>
                  <td className="num">€{item.price.toFixed(2)}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString('nl-BE')}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>✕</button>
                  </td>
                </tr>
              ))}
              {estimates.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>No estimates yet</td></tr>
              )}
            </tbody>
            {estimates.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={2}><strong>Total</strong></td>
                  <td className="num"><strong>€{total.toFixed(2)}</strong></td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </>
      )}
    </div>
  );
}
