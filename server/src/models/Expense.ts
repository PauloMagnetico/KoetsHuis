import mongoose from 'mongoose';

const CATEGORIES = ['Materials', 'Labor', 'Kitchen', 'Bathroom', 'Electrical', 'Plumbing', 'Flooring', 'Garden', 'Other'];

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  price: { type: Number, required: true },
  paidBy: { type: String, enum: ['Laurens', 'Julia'], required: true },
  category: { type: String, enum: CATEGORIES, default: 'Other' },
}, { timestamps: true });

export const Expense = mongoose.model('Expense', expenseSchema);
