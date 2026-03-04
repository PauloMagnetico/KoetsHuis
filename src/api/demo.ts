import type { Expense, Task, TaskStatus } from '../types';

const DEFAULT_CATEGORIES = ['Materiaal', 'Gereedschap', 'Afwerking', 'Isolatie', 'Elektra', 'Sanitair'];

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch { return fallback; }
}

function save(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Categories

export function demoGetCategories(): Promise<string[]> {
  return Promise.resolve(load<string[]>('demo_categories', DEFAULT_CATEGORIES));
}

export function demoCreateCategory(name: string): Promise<void> {
  const cats = load<string[]>('demo_categories', DEFAULT_CATEGORIES);
  if (!cats.includes(name)) save('demo_categories', [...cats, name]);
  return Promise.resolve();
}

export function demoDeleteCategory(name: string): Promise<void> {
  const cats = load<string[]>('demo_categories', DEFAULT_CATEGORIES);
  save('demo_categories', cats.filter(c => c !== name));
  return Promise.resolve();
}

// Expenses

export function demoGetExpenses(): Promise<Expense[]> {
  return Promise.resolve(load<Expense[]>('demo_expenses', []));
}

export function demoCreateExpense(data: Omit<Expense, '_id' | 'createdAt'>): Promise<Expense> {
  const expenses = load<Expense[]>('demo_expenses', []);
  const expense: Expense = { ...data, _id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  save('demo_expenses', [...expenses, expense]);
  return Promise.resolve(expense);
}

export function demoDeleteExpense(id: string): Promise<void> {
  const expenses = load<Expense[]>('demo_expenses', []);
  save('demo_expenses', expenses.filter(e => e._id !== id));
  return Promise.resolve();
}

// Tasks

export function demoGetTasks(): Promise<Task[]> {
  return Promise.resolve(load<Task[]>('demo_tasks', []));
}

export function demoCreateTask(data: { title: string; category: string; description?: string; assignedTo?: string | null }): Promise<Task> {
  const tasks = load<Task[]>('demo_tasks', []);
  const task: Task = {
    _id: crypto.randomUUID(),
    title: data.title,
    category: data.category,
    description: data.description ?? '',
    assignedTo: (data.assignedTo as Task['assignedTo']) ?? null,
    status: 'todo',
    createdAt: new Date().toISOString(),
  };
  save('demo_tasks', [...tasks, task]);
  return Promise.resolve(task);
}

export function demoUpdateTaskStatus(id: string, status: TaskStatus): Promise<void> {
  const tasks = load<Task[]>('demo_tasks', []);
  save('demo_tasks', tasks.map(t => t._id === id ? { ...t, status } : t));
  return Promise.resolve();
}

export function demoUpdateTask(id: string, data: Partial<Pick<Task, 'title' | 'description' | 'category' | 'assignedTo'>>): Promise<void> {
  const tasks = load<Task[]>('demo_tasks', []);
  save('demo_tasks', tasks.map(t => t._id === id ? { ...t, ...data } : t));
  return Promise.resolve();
}

export function demoDeleteTask(id: string): Promise<void> {
  const tasks = load<Task[]>('demo_tasks', []);
  save('demo_tasks', tasks.filter(t => t._id !== id));
  return Promise.resolve();
}
