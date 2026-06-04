import EditForm from '@/components/dashboard/EditForm';
import TaskRow  from '@/components/dashboard/TaskRow';
import type { Todo } from '@/types/todo';
import type { UpdateTodoRequest } from '@/types/requests';

interface Props {
  label: string;
  todos: Todo[];
  editingId:    string | null;
  onEdit:       (id: string) => void;
  onSave:       (id: string, data: UpdateTodoRequest) => void;
  onCancelEdit: () => void;
  onToggle:     (todo: Todo) => void;
  onDelete:     (id: string) => void;
}

const DateSection = ({
  label, todos, editingId, onEdit, onSave, onCancelEdit, onToggle, onDelete,
}: Props) => (
  <div className="mt-6 first:mt-0">
    <h2 className="mb-2 border-b border-quaternary-100 pb-1.5 text-sm font-semibold text-quaternary-700 dark:border-gray-800 dark:text-gray-300">
      {label}
    </h2>
    {todos.map(t =>
      editingId === t._id ? (
        <EditForm key={t._id} todo={t} onSave={onSave} onCancel={onCancelEdit} />
      ) : (
        <TaskRow
          key={t._id}
          todo={t}
          onToggle={() => onToggle(t)}
          onEdit={() => onEdit(t._id)}
          onDelete={() => onDelete(t._id)}
        />
      )
    )}
  </div>
);

export default DateSection;
