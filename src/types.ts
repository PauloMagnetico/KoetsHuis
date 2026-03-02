export type User = 'Laurens' | 'Julia';

export interface Expense {
  _id: string;
  description: string;
  price: number;
  paidBy: User;
  createdAt: string;
}
