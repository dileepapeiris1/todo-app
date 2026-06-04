import { Clock, Pencil, Trash2 } from 'lucide-react';

import { fmtTime } from '@/utils/date';
import type { Todo } from '@/types/todo';

interface Props {
  todo: Todo;
  onToggle: () => void;
  onEdit:   () => void;
  onDelete: () => void;
}

/**
 * Renders a single todo as a row with a completion checkbox, title,
 * optional description and due time, and hover-revealed edit/delete actions.
 *
 * @param {Props} props - Component props.
 * @returns {JSX.Element} The task row element.
 */
const TaskRow = ({ todo, onToggle, onEdit, onDelete }: Props) => (
  <div className={`group flex items-start gap-3 border-b border-quaternary-100 py-2.5 transition-colors hover:bg-quaternary-50/40 dark:border-gray-800 dark:hover:bg-gray-800/40 ${todo.done ? 'opacity-55' : ''}`}>
    <button
      onClick={onToggle}
      aria-label={todo.done ? 'Mark incomplete' : 'Mark complete'}
      className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-all ${
        todo.done
          ? 'border-primary bg-primary'
          : 'border-quaternary-300 hover:border-primary/60 dark:border-gray-600'
      }`}
    >
      {todo.done && (
        <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>

    <div className="min-w-0 flex-1">
      <p
        className={`break-words text-sm ${todo.done ? 'text-quaternary-400 dark:text-gray-500' : 'text-quaternary-800 dark:text-gray-100'}`}
        style={todo.done ? {
          textDecoration: 'line-through',
          textDecorationThickness: '1px',
          lineHeight: '1.5',
        } : { lineHeight: '1.5' }}
      >
        {todo.title}
      </p>
      {todo.description && (
        <p className="mt-0.5 line-clamp-2 break-words text-xs text-quaternary-400 dark:text-gray-500">{todo.description}</p>
      )}
      {todo.dueDate && (
        <span className="mt-1 flex items-center gap-1 text-xs text-primary">
          <Clock className="h-3 w-3" />
          {fmtTime(todo.dueDate)}
        </span>
      )}
    </div>

    <div className="mt-0.5 flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
      <button onClick={onEdit} aria-label="Edit"
        className="flex h-6 w-6 items-center justify-center rounded text-quaternary-300 transition-colors hover:text-quaternary-600 dark:text-gray-600 dark:hover:text-gray-300">
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button onClick={onDelete} aria-label="Delete"
        className="flex h-6 w-6 items-center justify-center rounded text-quaternary-300 transition-colors hover:text-primary dark:text-gray-600 dark:hover:text-primary">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  </div>
);

export default TaskRow;
