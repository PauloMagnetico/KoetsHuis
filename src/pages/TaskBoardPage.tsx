import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { MdAdd } from 'react-icons/md';
import { type Task, type TaskStatus, type User } from '../types';
import { getTasks, createTask, updateTaskStatus, updateTask, deleteTask } from '../api/tasks';
import { getCategories } from '../api/expenses';

// ── Category color ────────────────────────────────────────────────────────────

const PALETTE = ['#e63946','#2a9d8f','#e9a83a','#457b9d','#7b5ea7','#f4845f','#2d6a4f','#a8c5da','#c77dff','#06d6a0'];

function categoryColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
}

// ── Avatar ────────────────────────────────────────────────────────────────────

const AVATAR_COLORS: Record<User, { bg: string; fg: string }> = {
  Laurens: { bg: '#dbeafe', fg: '#1d4ed8' },
  Julia:   { bg: '#fce7f3', fg: '#be185d' },
};

function Avatar({ user }: { user: User }) {
  const { bg, fg } = AVATAR_COLORS[user];
  return (
    <span className="task-avatar" style={{ background: bg, color: fg }} title={user}>
      {user[0]}
    </span>
  );
}

// ── Task modal (create & edit) ────────────────────────────────────────────────

const USERS: User[] = ['Laurens', 'Julia'];

function TaskModal({
  task,
  categories,
  onSave,
  onClose,
}: {
  task: Task | null;
  categories: string[];
  onSave: (data: { title: string; description: string; category: string; assignedTo: User | null }, id?: string) => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [category, setCategory] = useState(task?.category ?? categories[0] ?? '');
  const [assignedTo, setAssignedTo] = useState<User | null>(task?.assignedTo ?? null);
  const [saving, setSaving] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  const isEdit = task !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ title, description, category, assignedTo }, task?._id);
    setSaving(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" ref={backdropRef} onClick={e => { if (e.target === backdropRef.current) onClose(); }}>
      <div className="modal">
        <div className="modal__header">
          <h2>{isEdit ? 'Taak bewerken' : 'Nieuwe taak'}</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal__body">
          <label>
            Titel
            <input value={title} onChange={e => setTitle(e.target.value)} required autoFocus />
          </label>
          <label>
            Omschrijving
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Optionele details…" />
          </label>
          <label>
            Categorie
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <div className="modal__field">
            <span className="modal__label">Toegewezen aan</span>
            <div className="modal__assignees">
              <button
                type="button"
                className={`assignee-btn${assignedTo === null ? ' assignee-btn--active' : ''}`}
                onClick={() => setAssignedTo(null)}
              >
                Niemand
              </button>
              {USERS.map(u => (
                <button
                  key={u}
                  type="button"
                  className={`assignee-btn${assignedTo === u ? ' assignee-btn--active' : ''}`}
                  style={assignedTo === u ? { background: AVATAR_COLORS[u].bg, color: AVATAR_COLORS[u].fg, borderColor: AVATAR_COLORS[u].fg } : {}}
                  onClick={() => setAssignedTo(u)}
                >
                  <Avatar user={u} /> {u}
                </button>
              ))}
            </div>
          </div>
          <div className="modal__footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Annuleren</button>
            <button type="submit" disabled={saving}>{saving ? 'Opslaan…' : isEdit ? 'Opslaan' : 'Aanmaken'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Task card (draggable) ────────────────────────────────────────────────────

function TaskCard({
  task,
  onDelete,
  onEdit,
  overlay = false,
}: {
  task: Task;
  onDelete?: () => void;
  onEdit?: () => void;
  overlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task._id });
  const color = categoryColor(task.category);

  return (
    <div
      ref={setNodeRef}
      className={`task-card${isDragging ? ' task-card--dragging' : ''}${overlay ? ' task-card--overlay' : ''}`}
      {...listeners}
      {...attributes}
    >
      <span className="task-card__title">{task.title}</span>
      {task.description && <p className="task-card__desc">{task.description}</p>}
      <div className="task-card__footer">
        <span className="badge category" style={{ background: color + '22', color }}>
          {task.category}
        </span>
        <div className="task-card__actions">
          {task.assignedTo && <Avatar user={task.assignedTo} />}
          {onEdit && (
            <button
              className="icon-btn"
              onPointerDown={e => e.stopPropagation()}
              onClick={onEdit}
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              className="icon-btn icon-btn--delete"
              onPointerDown={e => e.stopPropagation()}
              onClick={onDelete}
              title="Delete"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Column (droppable) ───────────────────────────────────────────────────────

const COLUMN_LABELS: Record<TaskStatus, string> = {
  'todo': 'Te doen',
  'in-progress': 'Bezig',
  'done': 'Gedaan',
};

function Column({
  id,
  tasks,
  onDelete,
  onEdit,
}: {
  id: TaskStatus;
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`board-column${isOver ? ' board-column--over' : ''}`}>
      <div className="board-column__header">
        <span className="board-column__title">{COLUMN_LABELS[id]}</span>
        <span className="board-column__count">{tasks.length}</span>
      </div>
      <div className="board-column__body" ref={setNodeRef}>
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} onDelete={() => onDelete(task._id)} onEdit={() => onEdit(task)} />
        ))}
      </div>
    </div>
  );
}

// ── Board page ───────────────────────────────────────────────────────────────

const COLUMNS: TaskStatus[] = ['todo', 'in-progress', 'done'];

export default function TaskBoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  // null = closed, undefined = create mode, Task = edit mode
  const [modalTask, setModalTask] = useState<Task | null | undefined>(undefined);

  useEffect(() => {
    getTasks().then(setTasks);
    getCategories().then(setCategories);
  }, []);

  const handleSave = async (
    data: { title: string; description: string; category: string; assignedTo: User | null },
    id?: string,
  ) => {
    if (id) {
      await updateTask(id, data);
      setTasks(prev => prev.map(t => t._id === id ? { ...t, ...data } : t));
    } else {
      const task = await createTask(data);
      setTasks(prev => [...prev, task]);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t._id !== id));
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find(t => t._id === active.id) ?? null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    if (!over) return;
    const newStatus = over.id as TaskStatus;
    const task = tasks.find(t => t._id === active.id);
    if (!task || task.status === newStatus) return;
    setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    updateTaskStatus(task._id, newStatus);
  };

  return (
    <div className="board-page">
      <div className="board-page__header">
        <h1>Takenbord</h1>
        <button className="btn-primary" onClick={() => setModalTask(null)}>
          <MdAdd size={18} /> Nieuwe taak
        </button>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="board">
          {COLUMNS.map(col => (
            <Column
              key={col}
              id={col}
              tasks={tasks.filter(t => t.status === col)}
              onDelete={handleDelete}
              onEdit={setModalTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} overlay />}
        </DragOverlay>
      </DndContext>

      {modalTask !== undefined && (
        <TaskModal
          task={modalTask}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModalTask(undefined)}
        />
      )}
    </div>
  );
}
