if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/expenses.db');

const db = new Database(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    _id     TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    price   REAL NOT NULL,
    paidBy  TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Other',
    createdAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS categories (
    name TEXT PRIMARY KEY
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    _id         TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    category    TEXT NOT NULL DEFAULT 'Other',
    status      TEXT NOT NULL DEFAULT 'todo',
    description TEXT NOT NULL DEFAULT '',
    assignedTo  TEXT,
    createdAt   TEXT NOT NULL
  )
`);

// Add columns if upgrading from older schema
for (const col of [
  'ALTER TABLE tasks ADD COLUMN description TEXT NOT NULL DEFAULT ""',
  'ALTER TABLE tasks ADD COLUMN assignedTo TEXT',
]) {
  try { db.exec(col); } catch { /* already exists */ }
}

// Seed default categories if the table is empty
const seedCategories = db.prepare('SELECT COUNT(*) as cnt FROM categories').get() as { cnt: number };
if (seedCategories.cnt === 0) {
  const insert = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
  for (const name of ['Materials', 'Labor', 'Kitchen', 'Bathroom', 'Electrical', 'Plumbing', 'Flooring', 'Garden', 'Other']) {
    insert.run(name);
  }
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/categories', (_req, res) => {
  const rows = db.prepare('SELECT name FROM categories ORDER BY name ASC').all() as { name: string }[];
  res.json(rows.map(r => r.name));
});

app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }
  const trimmed = name.trim();
  try {
    db.prepare('INSERT INTO categories (name) VALUES (?)').run(trimmed);
    res.status(201).json({ name: trimmed });
  } catch {
    res.status(409).json({ error: 'Category already exists' });
  }
});

app.delete('/api/categories/:name', (req, res) => {
  db.prepare('DELETE FROM categories WHERE name = ?').run(req.params.name);
  res.status(204).send();
});

app.get('/api/expenses', (_req, res) => {
  const expenses = db.prepare('SELECT * FROM expenses ORDER BY createdAt DESC').all();
  res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
  const { description, price, paidBy, category } = req.body;
  const _id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  db.prepare(
    'INSERT INTO expenses (_id, description, price, paidBy, category, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(_id, description, price, paidBy, category ?? 'Other', createdAt);
  res.status(201).json({ _id, description, price, paidBy, category: category ?? 'Other', createdAt });
});

app.delete('/api/expenses/:id', (req, res) => {
  db.prepare('DELETE FROM expenses WHERE _id = ?').run(req.params.id);
  res.status(204).send();
});

app.get('/api/tasks', (_req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY createdAt ASC').all();
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title, category, description, assignedTo } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const _id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  db.prepare('INSERT INTO tasks (_id, title, category, status, description, assignedTo, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(_id, title, category ?? 'Other', 'todo', description ?? '', assignedTo ?? null, createdAt);
  res.status(201).json({ _id, title, category: category ?? 'Other', status: 'todo', description: description ?? '', assignedTo: assignedTo ?? null, createdAt });
});

app.patch('/api/tasks/:id', (req, res) => {
  const { status, title, category, description, assignedTo } = req.body;
  const fields: string[] = [];
  const values: unknown[] = [];
  if (status !== undefined)      { fields.push('status = ?');      values.push(status); }
  if (title !== undefined)       { fields.push('title = ?');       values.push(title); }
  if (category !== undefined)    { fields.push('category = ?');    values.push(category); }
  if (description !== undefined) { fields.push('description = ?'); values.push(description); }
  if ('assignedTo' in req.body)  { fields.push('assignedTo = ?'); values.push(assignedTo ?? null); }
  if (fields.length === 0) return res.status(400).json({ error: 'nothing to update' });
  values.push(req.params.id);
  db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE _id = ?`).run(...values);
  res.status(204).send();
});

app.delete('/api/tasks/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE _id = ?').run(req.params.id);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
