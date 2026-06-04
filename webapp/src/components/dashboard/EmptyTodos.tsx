import EmptyIcon from '@/assets/empty-results/EmptyIcon';

/**
 * Displays an empty state illustration with a contextual label.
 *
 * @param {{ label: string }} props - Component props.
 * @param {string} props.label - Primary message shown beneath the illustration.
 * @returns {JSX.Element} The empty state element.
 */
const EmptyTodos = ({ label, onAddTask }: { label: string; onAddTask?: () => void }) => (
  <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3 text-center">
    <EmptyIcon className="h-32 w-auto opacity-80" />
    <p className="text-sm text-quaternary-500 dark:text-gray-400">{label}</p>
    <p className="text-xs text-quaternary-300 dark:text-gray-600">Click "Add task" to get started</p>
    {onAddTask && (
      <button
        onClick={onAddTask}
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-100 transition-colors hover:bg-primary-hover active:scale-98"
      >
        Add task
      </button>
    )}
  </div>
);

export default EmptyTodos;
