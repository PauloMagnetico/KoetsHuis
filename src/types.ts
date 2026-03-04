export type User = 'Laurens' | 'Julia';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  _id: string;
  title: string;
  category: string;
  status: TaskStatus;
  description: string;
  assignedTo: User | null;
  createdAt: string;
}

export interface Expense {
  _id: string;
  description: string;
  price: number;
  paidBy: User;
  category: string;
  createdAt: string;
}

export interface Estimate {
  _id: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
}

export interface Invoice {
  _id: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
}
