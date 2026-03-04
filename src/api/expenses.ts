import type { Expense } from '../types';
import { demoGetCategories, demoCreateCategory, demoDeleteCategory, demoGetExpenses, demoCreateExpense, demoDeleteExpense } from './demo';

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

export function getCategories(): Promise<string[]> {
  if (DEMO) return demoGetCategories();
  return fetch('/api/categories').then(r => r.json());
}

export function createCategory(name: string): Promise<void> {
  if (DEMO) return demoCreateCategory(name);
  return fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  }).then();
}

export function deleteCategory(name: string): Promise<void> {
  if (DEMO) return demoDeleteCategory(name);
  return fetch(`/api/categories/${encodeURIComponent(name)}`, { method: 'DELETE' }).then();
}

export function getExpenses(): Promise<Expense[]> {
  if (DEMO) return demoGetExpenses();
  return fetch('/api/expenses').then(r => r.json());
}

export function createExpense(data: Omit<Expense, '_id' | 'createdAt'>): Promise<Expense> {
  if (DEMO) return demoCreateExpense(data);
  return fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());
}

export function deleteExpense(id: string): Promise<void> {
  if (DEMO) return demoDeleteExpense(id);
  return fetch(`/api/expenses/${id}`, { method: 'DELETE' }).then();
}
