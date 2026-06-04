import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteTodos, fetchSearchPage } from '@/hooks/useTodos';
import { useAddTodo, useDeleteTodo, useToggleTodo, useUpdateTodo } from '@/hooks/useTodoMutations';
import AppLayout    from '@/components/common/AppLayout';
import AddForm      from '@/components/dashboard/AddForm';
import DateSection  from '@/components/dashboard/DateSection';
import EditForm     from '@/components/dashboard/EditForm';
import EmptySearch  from '@/components/dashboard/EmptySearch';
import EmptyTodos   from '@/components/dashboard/EmptyTodos';
import ErrorState   from '@/components/dashboard/ErrorState';
import Skeleton     from '@/components/dashboard/Skeleton';
import SortControls from '@/components/dashboard/SortControls';
import TaskRow      from '@/components/dashboard/TaskRow';
import { SortField, SortOrder } from '@/types/sorting';
import { View } from '@/types/views';
import type { Nullable } from '@/types/common';
import type { Todo } from '@/types/todo';
import { isToday } from '@/utils/date';
import { toErrorInfo } from '@/utils/error';
import { groupByDate } from '@/utils/group';

/**
 * Resolves the content header title from the active view and search state.
 *
 * @param {View} view - The currently active view.
 * @param {boolean} isSearchActive - Whether a search query is active.
 * @returns {string} The header title string.
 */
function getHeaderTitle(view: View, isSearchActive: boolean): string {
  if (isSearchActive) return 'Search Results';
  switch (view) {
    case View.Today:     return 'Today';
    case View.All:       return 'All Tasks';
    case View.Completed: return 'Completed';
  }
}

/**
 * Returns true for todos that belong in the Today view.
 * Pending: no due date or due today not yet past.
 * Completed: no due date or was due today.
 *
 * @param {Todo} todo - The todo to evaluate.
 * @param {Date} now - The current date and time.
 * @returns {boolean} Whether the todo should appear in Today.
 */
function isTodayOrNoDueDate(todo: Todo, now: Date): boolean {
  if (!todo.done) {
    if (!todo.dueDate) return true;
    return isToday(todo.dueDate) && new Date(todo.dueDate) >= now;
  }
  if (!todo.dueDate) return true;
  return isToday(todo.dueDate);
}

const TodoPage = () => {
  const [view,      setView]      = useState<View>(View.Today);
  const [adding,    setAdding]    = useState(false);
  const [editingId, setEditingId] = useState<Nullable<string>>(null);
  const [sortBy,    setSortBy]    = useState<SortField>(SortField.DueDate);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Asc);
  const [searchInput, setSearchInput] = useState('');

  // Search
  const [searchData,    setSearchData]    = useState<Todo[]>([]);
  const [searchTotal,   setSearchTotal]   = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loadingMore,   setLoadingMore]   = useState(false);
  const [searchError,   setSearchError]   = useState<unknown>(null);
  const todosSentinel  = useRef<HTMLDivElement>(null);
  const searchSentinel = useRef<HTMLDivElement>(null);

  const isSearchActive  = searchInput.trim().length > 0;
  const searchHasMore   = searchData.length > 0 && searchData.length < searchTotal;

  // Query
  const {
    data:               todosPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteTodos(sortBy, sortOrder);

  const allTodos = useMemo(
    () => todosPages?.pages.flatMap(page => page.data) ?? [],
    [todosPages],
  );

  const addMutation    = useAddTodo();
  const updateMutation = useUpdateTodo();
  const toggleMutation = useToggleTodo();
  const deleteMutation = useDeleteTodo();

  useEffect(() => {
    const el = todosSentinel.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) void fetchNextPage(); },
      { rootMargin: '200px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, view]);

  // Debounced search
  useEffect(() => {
    if (!searchInput.trim()) {
      setSearchData([]);
      setSearchTotal(0);
      setSearchError(null);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      setSearchData([]);
      setSearchError(null);
      try {
        const result = await fetchSearchPage(searchInput.trim(), 0);
        setSearchData(result.data ?? []);
        setSearchTotal(result.total ?? 0);
      } catch (err) {
        setSearchError(err);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Search infinite scroll
  const fetchMoreSearch = useCallback(async (): Promise<void> => {
    if (loadingMore || !searchHasMore) return;
    setLoadingMore(true);
    try {
      const result = await fetchSearchPage(searchInput.trim(), searchData.length);
      setSearchData(prev => [...prev, ...(result.data ?? [])]);
      setSearchTotal(result.total ?? 0);
    } catch (err) {
      setSearchError(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, searchHasMore, searchInput, searchData.length]);

  useEffect(() => {
    const el = searchSentinel.current;
    if (!el || !searchHasMore || loadingMore) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) void fetchMoreSearch(); },
      { rootMargin: '200px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchMoreSearch, searchHasMore, loadingMore]);

  // Navigation
  const handleViewChange = useCallback((nextView: View): void => {
    setView(nextView);
    setSearchInput('');
    setAdding(false);
    setEditingId(null);
  }, []);

  const handleSortOrderToggle = useCallback((): void => {
    setSortOrder(current => current === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc);
  }, []);

  // Derived values
  const todayTodos = useMemo(() => {
    const now     = new Date();
    const matched = allTodos.filter(todo => isTodayOrNoDueDate(todo, now));
    return [
      ...matched.filter(todo => !todo.done),
      ...matched.filter(todo =>  todo.done),
    ];
  }, [allTodos]);
  const completedTodos  = useMemo(() => allTodos.filter(todo => todo.done), [allTodos]);
  const allGroups       = useMemo(() => groupByDate(allTodos, sortBy, sortOrder), [allTodos, sortBy, sortOrder]);
  const completedGroups = useMemo(() => groupByDate(completedTodos, sortBy, sortOrder), [completedTodos, sortBy, sortOrder]);
  const todoError       = useMemo(() => error       ? toErrorInfo(error)       : null, [error]);
  const searchErrorInfo = useMemo(() => searchError ? toErrorInfo(searchError) : null, [searchError]);

  // Optimistic search updates
  function handleSearchToggle(todo: Todo): void {
    setSearchData(list => list.map(t => t._id === todo._id ? { ...t, done: !t.done } : t));
    toggleMutation.mutate(todo);
  }

  function handleSearchDelete(id: string): void {
    setSearchData(list => list.filter(t => t._id !== id));
    deleteMutation.mutate(id);
  }

  // Row renderers
  function renderRow(todo: Todo) {
    if (editingId === todo._id) {
      return (
        <EditForm
          key={todo._id}
          todo={todo}
          busy={updateMutation.isPending}
          onSave={(id, data) => { updateMutation.mutate({ id, data }); setEditingId(null); }}
          onCancel={() => setEditingId(null)}
        />
      );
    }
    return (
      <TaskRow
        key={todo._id}
        todo={todo}
        onToggle={() => toggleMutation.mutate(todo)}
        onEdit={() => setEditingId(todo._id)}
        onDelete={() => deleteMutation.mutate(todo._id)}
      />
    );
  }

  function renderSearchRow(todo: Todo) {
    if (editingId === todo._id) {
      return (
        <EditForm
          key={todo._id}
          todo={todo}
          busy={updateMutation.isPending}
          onSave={(id, data) => { updateMutation.mutate({ id, data }); setEditingId(null); }}
          onCancel={() => setEditingId(null)}
        />
      );
    }
    return (
      <TaskRow
        key={todo._id}
        todo={todo}
        onToggle={() => handleSearchToggle(todo)}
        onEdit={() => setEditingId(todo._id)}
        onDelete={() => handleSearchDelete(todo._id)}
      />
    );
  }

  const mutationPending =
    addMutation.isPending    ||
    updateMutation.isPending ||
    toggleMutation.isPending ||
    deleteMutation.isPending;

  return (
    <AppLayout
      headerTitle={getHeaderTitle(view, isSearchActive)}
      mutationPending={mutationPending}
      headerRight={
        !isSearchActive ? (
          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortBy={setSortBy}
            onSortOrder={handleSortOrderToggle}
          />
        ) : undefined
      }
      view={view}
      searchInput={searchInput}
      todayCount={todayTodos.length}
      completedCount={completedTodos.length}
      isSearchActive={isSearchActive}
      onAddTask={() => { handleViewChange(View.Today); setAdding(true); }}
      onViewChange={handleViewChange}
      onSearchChange={query => setSearchInput(query)}
      onSearchClear={() => setSearchInput('')}
    >
      {/* Search results — infinite scroll */}
      {isSearchActive && (
        searchLoading ? (
          <Skeleton />
        ) : searchErrorInfo ? (
          <ErrorState status={searchErrorInfo.status} message={searchErrorInfo.message} />
        ) : searchData.length === 0 ? (
          <EmptySearch query={searchInput} />
        ) : (
          <>
            {searchData.map(renderSearchRow)}
            <div ref={searchSentinel} className="h-1" />
            {loadingMore && <Skeleton />}
          </>
        )
      )}

      {/* Today — pending first, completed at bottom */}
      {!isSearchActive && view === View.Today && (
        isLoading ? <Skeleton /> : todoError ? (
          <ErrorState status={todoError.status} message={todoError.message} />
        ) : (
          <>
            {adding && (
              <AddForm
                busy={addMutation.isPending}
                onAdd={data => { addMutation.mutate(data); setAdding(false); }}
                onCancel={() => setAdding(false)}
              />
            )}
            {todayTodos.length === 0 && !adding
              ? <EmptyTodos label="No tasks due today" />
              : todayTodos.map(renderRow)}
            {hasNextPage && <div ref={todosSentinel} className="h-1" />}
            {isFetchingNextPage && <Skeleton />}
          </>
        )
      )}

      {/* All Tasks — grouped by date */}
      {!isSearchActive && view === View.All && (
        isLoading ? <Skeleton /> : todoError ? (
          <ErrorState status={todoError.status} message={todoError.message} />
        ) : allGroups.length === 0 ? (
          <EmptyTodos label="No tasks yet" />
        ) : (
          <>
            {allGroups.map(({ label, items }) => (
              <DateSection
                key={label}
                label={label}
                todos={items}
                editingId={editingId}
                onEdit={setEditingId}
                onSave={(id, data) => { updateMutation.mutate({ id, data }); setEditingId(null); }}
                onCancelEdit={() => setEditingId(null)}
                onToggle={todo => toggleMutation.mutate(todo)}
                onDelete={id => deleteMutation.mutate(id)}
              />
            ))}
            {hasNextPage && <div ref={todosSentinel} className="h-1" />}
            {isFetchingNextPage && <Skeleton />}
          </>
        )
      )}

      {/* Completed — grouped by date */}
      {!isSearchActive && view === View.Completed && (
        isLoading ? <Skeleton /> : todoError ? (
          <ErrorState status={todoError.status} message={todoError.message} />
        ) : completedGroups.length === 0 ? (
          <EmptyTodos label="No completed tasks yet" />
        ) : (
          <>
            {completedGroups.map(({ label, items }) => (
              <DateSection
                key={label}
                label={label}
                todos={items}
                editingId={editingId}
                onEdit={setEditingId}
                onSave={(id, data) => { updateMutation.mutate({ id, data }); setEditingId(null); }}
                onCancelEdit={() => setEditingId(null)}
                onToggle={todo => toggleMutation.mutate(todo)}
                onDelete={id => deleteMutation.mutate(id)}
              />
            ))}
            {hasNextPage && <div ref={todosSentinel} className="h-1" />}
            {isFetchingNextPage && <Skeleton />}
          </>
        )
      )}
    </AppLayout>
  );
};

export default TodoPage;
