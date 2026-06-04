import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import {
  createContext, useCallback, useContext, useState, type ReactNode,
} from 'react';

import { SnackType, type Snack } from '@/types/snack';

interface SnackbarContextType {
  showSnack: (message: string, type: SnackType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

/**
 * Hook to trigger snackbar notifications from any component inside SnackbarProvider.
 *
 * @returns {SnackbarContextType} Object containing the showSnack function.
 */
export function useSnackbar(): SnackbarContextType {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider');
  return ctx;
}

/**
 * Renders the fixed-position list of active snack notifications.
 *
 * @param {{ snacks: Snack[]; onDismiss: (id: number) => void }} props - Component props.
 * @returns {JSX.Element} The snackbar display element.
 */
function SnackbarDisplay({
  snacks, onDismiss,
}: { snacks: Snack[]; onDismiss: (id: number) => void }) {
  const errorClass   = 'bg-red-500';
  const successClass = 'bg-green-600';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {snacks.map(snack => (
        <div key={snack.id}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white shadow-xl ${snack.type === SnackType.Error ? errorClass : successClass}`}
        >
          {snack.type === SnackType.Success
            ? <CheckCircle2 className="h-4 w-4 shrink-0" />
            : <AlertCircle  className="h-4 w-4 shrink-0" />}
          <span className="max-w-xs">{snack.message}</span>
          <button onClick={() => onDismiss(snack.id)} className="ml-1 opacity-60 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * Provides showSnack to the component tree and renders the snackbar display.
 * Snacks auto-dismiss after 4 seconds or can be dismissed manually.
 *
 * @param {{ children: ReactNode }} props - Component props.
 * @returns {JSX.Element} The provider wrapping its children with snackbar support.
 */
export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snacks, setSnacks] = useState<Snack[]>([]);

  const showSnack = useCallback((message: string, type: SnackType) => {
    const id = Date.now();
    setSnacks(prev => [...prev, { id, message, type }]);
    setTimeout(() => setSnacks(prev => prev.filter(snack => snack.id !== id)), 4000);
  }, []);

  function dismiss(id: number) {
    setSnacks(prev => prev.filter(snack => snack.id !== id));
  }

  return (
    <SnackbarContext.Provider value={{ showSnack }}>
      {children}
      <SnackbarDisplay snacks={snacks} onDismiss={dismiss} />
    </SnackbarContext.Provider>
  );
}
