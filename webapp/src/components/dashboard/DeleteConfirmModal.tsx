interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel:  () => void;
}

/**
 * A modal dialog that prompts the user to confirm task deletion.
 *
 * @param {DeleteConfirmModalProps} props - Component props.
 * @returns {JSX.Element} The modal element.
 */
const DeleteConfirmModal = ({ onConfirm, onCancel }: DeleteConfirmModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
    <div className="w-full max-w-[360px] transform rounded-2xl bg-white p-6 shadow-xl transition-all dark:bg-gray-800 dark:border dark:border-gray-700">
      <h3 className="text-lg font-bold text-quaternary-900 dark:text-gray-100">Delete Task</h3>
      <p className="mt-2 text-sm text-quaternary-400 dark:text-gray-400">
        Are you sure you want to delete this task? This action cannot be undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-xl bg-quaternary-100 px-4 py-2 text-sm font-medium text-quaternary-700 hover:bg-quaternary-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirmModal;
