import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  price: { type: Number, required: true },
  paidBy: { type: String, enum: ['Laurens', 'Julia'], required: true },
}, { timestamps: true });

export const Expense = mongoose.model('Expense', expenseSchema);
