import type { Estimate } from '../types';
import { demoGetEstimates, demoCreateEstimate, demoDeleteEstimate } from './demo';

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

export function getEstimates(): Promise<Estimate[]> {
  if (DEMO) return demoGetEstimates();
  return fetch('/api/estimates').then(r => r.json());
}

export function createEstimate(data: Omit<Estimate, '_id' | 'createdAt'>): Promise<Estimate> {
  if (DEMO) return demoCreateEstimate(data);
  return fetch('/api/estimates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());
}

export function deleteEstimate(id: string): Promise<void> {
  if (DEMO) return demoDeleteEstimate(id);
  return fetch(`/api/estimates/${id}`, { method: 'DELETE' }).then();
}
