import type { Invoice } from '../types';
import { demoGetInvoices, demoCreateInvoice, demoDeleteInvoice } from './demo';

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

export function getInvoices(): Promise<Invoice[]> {
  if (DEMO) return demoGetInvoices();
  return fetch('/api/invoices').then(r => r.json());
}

export function createInvoice(data: Omit<Invoice, '_id' | 'createdAt'>): Promise<Invoice> {
  if (DEMO) return demoCreateInvoice(data);
  return fetch('/api/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());
}

export function deleteInvoice(id: string): Promise<void> {
  if (DEMO) return demoDeleteInvoice(id);
  return fetch(`/api/invoices/${id}`, { method: 'DELETE' }).then();
}
