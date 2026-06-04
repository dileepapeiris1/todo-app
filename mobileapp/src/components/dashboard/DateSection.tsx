/** Date group header followed by its task rows. */

import { StyleSheet, Text, View } from 'react-native';
import { TaskRow } from './TaskRow';
import type { Todo } from '@/types/todo';

interface Props {
  label:    string;
  todos:    Todo[];
  onToggle: (todo: Todo) => void;
  onEdit:   (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function DateSection({ label, todos, onToggle, onEdit, onDelete }: Props) {
  return (
    <View>
      <Text style={styles.header}>{label}</Text>
      {todos.map(todo => (
        <TaskRow
          key={todo._id}
          todo={todo}
          onToggle={() => onToggle(todo)}
          onEdit={() => onEdit(todo)}
          onDelete={() => onDelete(todo._id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
