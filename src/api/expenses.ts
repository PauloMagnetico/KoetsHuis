import type { Expense } from '../types';

export async function getCategories(): Promise<string[]> {
  const res = await fetch('/api/categories');
  return res.json();
}

export async function createCategory(name: string): Promise<void> {
  await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
}

export async function deleteCategory(name: string): Promise<void> {
  await fetch(`/api/categories/${encodeURIComponent(name)}`, { method: 'DELETE' });
}

export async function getExpenses(): Promise<Expense[]> {
  const res = await fetch('/api/expenses');
  return res.json();
}

export async function createExpense(data: Omit<Expense, '_id' | 'createdAt'>): Promise<Expense> {
  const res = await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteExpense(id: string): Promise<void> {
  await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
}
