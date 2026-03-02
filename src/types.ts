export type User = 'Laurens' | 'Julia';

export const CATEGORIES = [
  'Materials',
  'Labor',
  'Kitchen',
  'Bathroom',
  'Electrical',
  'Plumbing',
  'Flooring',
  'Garden',
  'Other',
] as const;

export type Category = typeof CATEGORIES[number];

export interface Expense {
  _id: string;
  description: string;
  price: number;
  paidBy: User;
  category: Category;
  createdAt: string;
}
