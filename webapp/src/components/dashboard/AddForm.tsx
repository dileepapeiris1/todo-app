import { Calendar, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TITLE_MAX_LENGTH, DESC_MAX_LENGTH } from '@/constants/validation';
import { nowDateTimeLocal } from '@/utils/date';
import type { CreateTodoRequest } from '@/types/requests';

interface Props {
  onAdd:    (data: CreateTodoRequest) => void;
  onCancel: () => void;
  busy?:    boolean;
}

/**
 * Renders the add-task inline form. Auto-focuses the title input on mount.
 *
 * @param {Props} props - Component props.
 * @param {(data: CreateTodoRequest) => void} props.onAdd - Called with form data on submit.
 * @param {() => void} props.onCancel - Called when Cancel is clicked or Escape is pressed.
 * @param {boolean} [props.busy] - Disables inputs while a mutation is in-flight.
 * @returns {JSX.Element} The add form element.
 */
const AddForm = ({ onAdd, onCancel, busy = false }: Props) => {
  const [title,   setTitle]   = useState('');
  const [desc,    setDesc]    = useState('');
  const [dueDate, setDueDate] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { ref.current?.focus(); }, []);

  const submit = () => {
    if (!title.trim()) { onCancel(); return; }
    onAdd({ title: title.trim(), description: desc.trim() || undefined, dueDate: dueDate || undefined });
  };

  return (
    <div className="mb-4 rounded-xl border border-quaternary-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:border-gray-600 dark:bg-gray-800">
      <div className="px-4 pb-3 pt-3.5">
        <input
          ref={ref}
          value={title}
          onChange={e => setTitle(e.target.value.slice(0, TITLE_MAX_LENGTH))}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } if (e.key === 'Escape') onCancel(); }}
          placeholder="Task name"
          disabled={busy}
          className="w-full bg-transparent text-sm font-medium text-quaternary-900 outline-none placeholder:text-quaternary-300 dark:text-gray-100 dark:placeholder:text-gray-600"
        />
        <input
          value={desc}
          onChange={e => setDesc(e.target.value.slice(0, DESC_MAX_LENGTH))}
          onKeyDown={e => { if (e.key === 'Escape') onCancel(); }}
          placeholder="Description"
          disabled={busy}
          className="mt-1 w-full bg-transparent text-xs text-quaternary-500 outline-none placeholder:text-quaternary-300 dark:text-gray-400 dark:placeholder:text-gray-600"
        />
        <div className="mt-3 flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-quaternary-500 dark:text-gray-400">
            <Calendar className="h-3.5 w-3.5 text-quaternary-400" /> Due date
          </label>
          <input
            type="datetime-local"
            value={dueDate}
            min={nowDateTimeLocal()}
            onChange={e => setDueDate(e.target.value)}
            disabled={busy}
            className="rounded-lg border border-quaternary-200 px-2 py-1 text-xs text-quaternary-700 outline-none focus:border-primary transition-colors dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          {dueDate && (
            <button onClick={() => setDueDate('')} className="text-quaternary-300 hover:text-quaternary-500">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-quaternary-100 px-4 py-2.5 dark:border-gray-700">
        <button onClick={onCancel}
          className="rounded-lg border border-quaternary-200 px-3.5 py-1.5 text-xs text-quaternary-600 hover:bg-quaternary-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
          Cancel
        </button>
        <button onClick={submit} disabled={!title.trim() || busy}
          className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors">
          Add task
        </button>
      </div>
    </div>
  );
};

export default AddForm;
