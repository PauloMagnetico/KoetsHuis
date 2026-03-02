if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Expense } from './models/Expense';

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/koetshuis';

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Database connected:', dbUrl));

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/expenses', async (_req, res) => {
  const expenses = await Expense.find().sort({ createdAt: -1 });
  res.json(expenses);
});

app.post('/api/expenses', async (req, res) => {
  const { description, price, paidBy } = req.body;
  const expense = new Expense({ description, price, paidBy });
  await expense.save();
  res.status(201).json(expense);
});

app.delete('/api/expenses/:id', async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
