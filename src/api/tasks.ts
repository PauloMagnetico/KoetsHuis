import type { Task, TaskStatus } from '../types';
import { demoGetTasks, demoCreateTask, demoUpdateTaskStatus, demoUpdateTask, demoDeleteTask } from './demo';

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

export function getTasks(): Promise<Task[]> {
  if (DEMO) return demoGetTasks();
  return fetch('/api/tasks').then(r => r.json());
}

export function createTask(data: { title: string; category: string; description?: string; assignedTo?: string | null }): Promise<Task> {
  if (DEMO) return demoCreateTask(data);
  return fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());
}

export function updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
  if (DEMO) return demoUpdateTaskStatus(id, status);
  return fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).then();
}

export function updateTask(id: string, data: Partial<Pick<Task, 'title' | 'description' | 'category' | 'assignedTo'>>): Promise<void> {
  if (DEMO) return demoUpdateTask(id, data);
  return fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then();
}

export function deleteTask(id: string): Promise<void> {
  if (DEMO) return demoDeleteTask(id);
  return fetch(`/api/tasks/${id}`, { method: 'DELETE' }).then();
}
