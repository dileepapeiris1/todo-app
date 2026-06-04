/** Main todo page — orchestrates views, search, sorting, and CRUD. */

import {
  FlatList, RefreshControl, SafeAreaView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import {
  useInfiniteTodos,
  fetchSearchPage,
  getErrorStatus,
} from '@/hooks/useTodos';
import {
  useAddTodo, useDeleteTodo, useToggleTodo, useUpdateTodo,
} from '@/hooks/useTodoMutations';
import { AddForm }     from '@/components/dashboard/AddForm';
import { EditForm }    from '@/components/dashboard/EditForm';
import { DateSection } from '@/components/dashboard/DateSection';
import { Skeleton }    from '@/components/dashboard/Skeleton';
import { TaskRow }     from '@/components/dashboard/TaskRow';
import { SortField, SortOrder } from '@/types/sorting';
import { View as AppView } from '@/types/views';
import type { Nullable } from '@/types/common';
import type { Todo } from '@/types/todo';
import type { Paginated } from '@/types/pagination';
import { isToday } from '@/utils/date';
import { groupByDate } from '@/utils/group';
import { toErrorInfo } from '@/utils/error';
import { APP_NAME } from '@/constants/config';

const TABS: { label: string; view: AppView }[] = [
  { label: 'Today',     view: AppView.Today },
  { label: 'All Tasks', view: AppView.All },
  { label: 'Completed', view: AppView.Completed },
];

function isTodayOrNoDueDate(todo: Todo, now: Date): boolean {
  if (!todo.done) {
    if (!todo.dueDate) return true;
    return isToday(todo.dueDate) && new Date(todo.dueDate) >= now;
  }
  if (!todo.dueDate) return true;
  return isToday(todo.dueDate);
}

export default function TodoPage() {
  const { user, signOut } = useAuth();
  const router             = useRouter();

  const [activeView, setActiveView] = useState<AppView>(AppView.Today);
  const [editingTodo, setEditingTodo] = useState<Nullable<Todo>>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy,    setSortBy]    = useState<SortField>(SortField.DueDate);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Asc);
  const [searchQuery, setSearchQuery] = useState('');

  // Search local state (accumulated for infinite scroll)
  const [searchData,    setSearchData]    = useState<Todo[]>([]);
  const [searchTotal,   setSearchTotal]   = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOffset,  setSearchOffset]  = useState(0);
  const searchHasMore = searchData.length > 0 && searchData.length < searchTotal;

  // Main data via TanStack infinite query
  const {
    data:               todosPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
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

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchData([]);
      setSearchTotal(0);
      setSearchOffset(0);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      setSearchData([]);
      try {
        const result = await fetchSearchPage(searchQuery.trim(), 0);
        setSearchData(result.data ?? []);
        setSearchTotal(result.total ?? 0);
        setSearchOffset(0);
      } catch {
        // error handled silently on mobile
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Derived values
  const now            = new Date();
  const todayTodos     = useMemo(() => {
    const matched = allTodos.filter(todo => isTodayOrNoDueDate(todo, now));
    return [...matched.filter(t => !t.done), ...matched.filter(t => t.done)];
  }, [allTodos]);
  const completedTodos  = useMemo(() => allTodos.filter(t => t.done), [allTodos]);
  const allGroups       = useMemo(() => groupByDate(allTodos, sortBy, sortOrder), [allTodos, sortBy, sortOrder]);
  const completedGroups = useMemo(() => groupByDate(completedTodos, sortBy, sortOrder), [completedTodos, sortBy, sortOrder]);
  const isSearchActive  = searchQuery.trim().length > 0;

  function handleSignOut() {
    signOut();
    router.replace('/sign-in');
  }

  function renderTodo(todo: Todo) {
    return (
      <TaskRow
        todo={todo}
        onToggle={() => toggleMutation.mutate(todo)}
        onEdit={() => setEditingTodo(todo)}
        onDelete={() => deleteMutation.mutate(todo._id)}
      />
    );
  }

  // What to show in the FlatList
  type Section = { type: 'todo'; todo: Todo } | { type: 'header'; label: string } | { type: 'empty'; msg: string };

  const listItems = useMemo((): Section[] => {
    if (isSearchActive) {
      if (searchData.length === 0) return [{ type: 'empty', msg: `No tasks match "${searchQuery}"` }];
      return searchData.map(todo => ({ type: 'todo', todo }));
    }
    switch (activeView) {
      case AppView.Today:
        if (todayTodos.length === 0) return [{ type: 'empty', msg: 'No tasks due today' }];
        return todayTodos.map(todo => ({ type: 'todo', todo }));

      case AppView.All:
        if (allGroups.length === 0) return [{ type: 'empty', msg: 'No tasks yet' }];
        return allGroups.flatMap(group => [
          { type: 'header' as const, label: group.label },
          ...group.items.map(todo => ({ type: 'todo' as const, todo })),
        ]);

      case AppView.Completed:
        if (completedGroups.length === 0) return [{ type: 'empty', msg: 'No completed tasks yet' }];
        return completedGroups.flatMap(group => [
          { type: 'header' as const, label: group.label },
          ...group.items.map(todo => ({ type: 'todo' as const, todo })),
        ]);
    }
  }, [isSearchActive, searchData, searchQuery, activeView, todayTodos, allGroups, completedGroups]);

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>{APP_NAME}</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks…"
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab bar */}
      {!isSearchActive && (
        <View style={styles.tabs}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.view}
              style={[styles.tab, activeView === tab.view && styles.tabActive]}
              onPress={() => setActiveView(tab.view)}
            >
              <Text style={[styles.tabText, activeView === tab.view && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Task list */}
      {(isLoading || searchLoading) ? (
        <Skeleton />
      ) : (
        <FlatList
          data={listItems}
          keyExtractor={(item, index) =>
            item.type === 'todo' ? item.todo._id : `${item.type}-${index}`
          }
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return <Text style={styles.sectionHeader}>{item.label}</Text>;
            }
            if (item.type === 'empty') {
              return <Text style={styles.emptyText}>{item.msg}</Text>;
            }
            return renderTodo(item.todo);
          }}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
          }}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => void refetch()}
              tintColor="#e44332"
            />
          }
          ListFooterComponent={isFetchingNextPage ? <Skeleton /> : null}
          contentContainerStyle={listItems.length === 0 ? styles.emptyContainer : undefined}
        />
      )}

      {/* FAB — add task */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAddForm(true)}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Add form modal */}
      <AddForm
        visible={showAddForm}
        busy={addMutation.isPending}
        onAdd={data => { addMutation.mutate(data); setShowAddForm(false); }}
        onCancel={() => setShowAddForm(false)}
      />

      {/* Edit form modal */}
      <EditForm
        todo={editingTodo}
        visible={editingTodo !== null}
        busy={updateMutation.isPending}
        onSave={(id, data) => { updateMutation.mutate({ id, data }); setEditingTodo(null); }}
        onCancel={() => setEditingTodo(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  brand: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    paddingVertical: 10,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 10,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  tabActive: {
    backgroundColor: '#fee2de',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#e44332',
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 60,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e44332',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e44332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 28,
    color: '#ffffff',
    lineHeight: 32,
  },
});
