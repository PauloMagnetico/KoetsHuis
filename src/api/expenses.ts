import { Expense } from '../types';

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
