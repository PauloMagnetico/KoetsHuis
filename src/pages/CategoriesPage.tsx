import { useEffect, useState } from 'react';
import { getCategories, createCategory, deleteCategory } from '../api/expenses';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => getCategories().then(setCategories);

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      setError('Category already exists');
      return;
    }
    setSubmitting(true);
    setError('');
    await createCategory(trimmed);
    setNewName('');
    await load();
    setSubmitting(false);
  };

  const handleDelete = async (name: string) => {
    await deleteCategory(name);
    setCategories(prev => prev.filter(c => c !== name));
  };

  return (
    <div className="page">
      <h1>Categories</h1>

      <form className="expense-form" onSubmit={handleAdd} style={{ maxWidth: 360 }}>
        <input
          type="text"
          placeholder="New category name"
          value={newName}
          onChange={e => { setNewName(e.target.value); setError(''); }}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Category'}
        </button>
        {error && <span style={{ color: '#e63946', fontSize: '0.85rem' }}>{error}</span>}
      </form>

      <table className="expense-table" style={{ marginTop: '1.5rem', maxWidth: 400 }}>
        <thead>
          <tr>
            <th>Category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat}>
              <td><span className="badge category">{cat}</span></td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(cat)}>✕</button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr><td colSpan={2} style={{ textAlign: 'center', color: '#888' }}>No categories yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
