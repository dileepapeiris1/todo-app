import { Calendar, ClipboardList, ListChecks, Plus, Search, X } from 'lucide-react';
import { View } from '@/types/views';

interface Props {
  collapsed:      boolean;
  view:           View;
  searchInput:    string;
  todayCount:     number;
  completedCount: number;
  isSearchActive: boolean;
  isMobileSheet?: boolean;
  onAddTask:      () => void;
  onViewChange:   (view: View) => void;
  onSearchChange: (query: string) => void;
  onSearchClear:  () => void;
}

function getDesktopNavClass(isActive: boolean, isCollapsed: boolean): string {
  const base    = 'flex w-full items-center rounded-lg py-[7px] text-sm transition-colors';
  const spacing = isCollapsed
    ? 'gap-2.5 px-2.5 lg:justify-center lg:gap-0 lg:px-0'
    : 'gap-2.5 px-2.5';
  const color   = isActive
    ? 'bg-primary-50 font-medium text-primary dark:bg-primary/10'
    : 'text-quaternary-700 hover:bg-quaternary-100/70 dark:text-gray-300 dark:hover:bg-gray-700/70';
  return `${base} ${spacing} ${color}`;
}

function getSheetNavClass(isActive: boolean): string {
  const base  = 'flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors';
  const color = isActive
    ? 'bg-primary-50 text-primary dark:bg-primary/10'
    : 'text-quaternary-700 hover:bg-quaternary-100/70 dark:text-gray-300 dark:hover:bg-gray-700/70';
  return `${base} ${color}`;
}

function getNavIconClass(isActive: boolean, isMobileSheet: boolean): string {
  const size = isMobileSheet ? 'h-5 w-5' : 'h-4 w-4';
  return `${size} shrink-0 ${isActive ? 'text-primary' : 'text-quaternary-500 dark:text-gray-400'}`;
}

function getBadgeClass(isActive: boolean): string {
  return isActive
    ? 'text-xs tabular-nums font-semibold text-primary'
    : 'text-xs tabular-nums text-quaternary-400 dark:text-gray-500';
}

const AppSidebar = ({
  collapsed, view, searchInput, todayCount, completedCount,
  isSearchActive, isMobileSheet = false,
  onAddTask, onViewChange, onSearchChange, onSearchClear,
}: Props) => {
  const todayActive     = view === View.Today     && !isSearchActive;
  const allActive       = view === View.All       && !isSearchActive;
  const completedActive = view === View.Completed && !isSearchActive;

  if (isMobileSheet) {
    return (
      <div className="flex flex-col gap-1 px-3 pb-2">
        <button onClick={onAddTask}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-quaternary-700 transition-colors hover:bg-quaternary-100/70 dark:text-gray-200 dark:hover:bg-gray-700/70">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <Plus className="h-3.5 w-3.5" strokeWidth={3} />
          </div>
          Add task
        </button>

        <div className="relative px-0 py-1">
          <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-quaternary-300 dark:text-gray-500" />
          <input value={searchInput} onChange={e => onSearchChange(e.target.value)} placeholder="Search tasks…"
            className="w-full rounded-xl border border-quaternary-200 bg-white py-3 pl-11 pr-10 text-sm text-quaternary-700 outline-none transition-colors focus:border-primary placeholder:text-quaternary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500" />
          {searchInput && (
            <button onClick={onSearchClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-quaternary-300 hover:text-quaternary-500 dark:text-gray-500 dark:hover:text-gray-300">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="my-1 border-t border-quaternary-100 dark:border-gray-700" />

        <button onClick={() => onViewChange(View.Today)} className={getSheetNavClass(todayActive)}>
          <Calendar className={getNavIconClass(todayActive, true)} />
          <span className="flex-1 text-left">Today</span>
          {todayCount > 0 && <span className={getBadgeClass(todayActive)}>{todayCount}</span>}
        </button>
        <button onClick={() => onViewChange(View.All)} className={getSheetNavClass(allActive)}>
          <ClipboardList className={getNavIconClass(allActive, true)} />
          <span className="flex-1 text-left">All Tasks</span>
        </button>
        <button onClick={() => onViewChange(View.Completed)} className={getSheetNavClass(completedActive)}>
          <ListChecks className={getNavIconClass(completedActive, true)} />
          <span className="flex-1 text-left">Completed</span>
          {completedCount > 0 && <span className={getBadgeClass(completedActive)}>{completedCount}</span>}
        </button>
      </div>
    );
  }

  return (
    <aside className={`flex h-full shrink-0 flex-col border-r border-quaternary-200 bg-[#fafaf9] transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 w-[220px] ${collapsed ? 'lg:w-[52px]' : ''}`}>

      <div className="px-2 py-2">
        <button onClick={onAddTask} title="Add task"
          className={`flex w-full items-center rounded-lg py-1.5 text-sm text-quaternary-700 transition-colors hover:bg-quaternary-100/70 dark:text-gray-200 dark:hover:bg-gray-700/70 gap-2.5 px-2 ${collapsed ? 'lg:justify-center lg:gap-0 lg:px-0' : ''}`}>
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <Plus className="h-3 w-3" strokeWidth={3} />
          </div>
          <span className={`font-medium ${collapsed ? 'lg:hidden' : ''}`}>Add task</span>
        </button>
      </div>

      <div className="px-2 pb-2">
        <div className={`items-center justify-center rounded-lg py-1.5 text-quaternary-400 dark:text-gray-500 ${collapsed ? 'hidden lg:flex' : 'hidden'}`}>
          <Search className="h-4 w-4" />
        </div>
        <div className={`relative ${collapsed ? 'lg:hidden' : ''}`}>
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-quaternary-300 dark:text-gray-500" />
          <input value={searchInput} onChange={event => onSearchChange(event.target.value)} placeholder="Search…"
            className="w-full rounded-lg border border-quaternary-200 bg-white py-1.5 pl-8 pr-3 text-xs text-quaternary-700 outline-none transition-colors focus:border-primary placeholder:text-quaternary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500" />
          {searchInput && (
            <button onClick={onSearchClear} className="absolute right-2 top-1/2 -translate-y-1/2 text-quaternary-300 hover:text-quaternary-500 dark:text-gray-500 dark:hover:text-gray-300">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <nav className="space-y-0.5 px-2">
        <button onClick={() => onViewChange(View.Today)} title="Today" className={getDesktopNavClass(todayActive, collapsed)}>
          <Calendar className={getNavIconClass(todayActive, false)} />
          <span className={`flex-1 text-left ${collapsed ? 'lg:hidden' : ''}`}>Today</span>
          {todayCount > 0 && <span className={`${getBadgeClass(todayActive)} ${collapsed ? 'lg:hidden' : ''}`}>{todayCount}</span>}
        </button>
        <button onClick={() => onViewChange(View.All)} title="All Tasks" className={getDesktopNavClass(allActive, collapsed)}>
          <ClipboardList className={getNavIconClass(allActive, false)} />
          <span className={`flex-1 text-left ${collapsed ? 'lg:hidden' : ''}`}>All Tasks</span>
        </button>
        <button onClick={() => onViewChange(View.Completed)} title="Completed" className={getDesktopNavClass(completedActive, collapsed)}>
          <ListChecks className={getNavIconClass(completedActive, false)} />
          <span className={`flex-1 text-left ${collapsed ? 'lg:hidden' : ''}`}>Completed</span>
          {completedCount > 0 && <span className={`${getBadgeClass(completedActive)} ${collapsed ? 'lg:hidden' : ''}`}>{completedCount}</span>}
        </button>
      </nav>
    </aside>
  );
};

export default AppSidebar;
