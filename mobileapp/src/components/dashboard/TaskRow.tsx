/** Single task row with checkbox, title, description, due time, and swipe actions. */

import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Check, Clock, Pencil, Trash2 } from 'lucide-react-native';
import { fmtTime } from '@/utils/date';
import { COLORS } from '@/constants/theme';
import type { Todo } from '@/types/todo';

interface Props {
  todo:     Todo;
  onToggle: () => void;
  onEdit:   () => void;
  onDelete: () => void;
}

export function TaskRow({ todo, onToggle, onEdit, onDelete }: Props) {
  function confirmDelete() {
    Alert.alert(
      'Delete task',
      'This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ],
    );
  }

  return (
    <View style={[styles.row, todo.done && styles.rowDone]}>
      {/* Checkbox */}
      <TouchableOpacity
        onPress={onToggle}
        style={[styles.checkbox, todo.done && styles.checkboxDone]}
        accessibilityLabel={todo.done ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.done && <Check size={12} color="#ffffff" strokeWidth={3} />}
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[styles.title, todo.done && styles.titleDone]}
          numberOfLines={2}
        >
          {todo.title}
        </Text>
        {todo.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {todo.description}
          </Text>
        ) : null}
        {todo.dueDate ? (
          <View style={styles.dueContainer}>
            <Clock size={12} color="#e44332" style={styles.dueIcon} />
            <Text style={styles.dueTime}>{fmtTime(todo.dueDate)}</Text>
          </View>
        ) : null}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionBtn} accessibilityLabel="Edit">
          <Pencil size={16} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={confirmDelete} style={styles.actionBtn} accessibilityLabel="Delete">
          <Trash2 size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  rowDone: {
    opacity: 0.55,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginTop: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    borderColor: '#e44332',
    backgroundColor: '#e44332',
  },
  checkmark: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  description: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  dueTime: {
    fontSize: 11,
    color: '#e44332',
  },
  dueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dueIcon: {
    marginRight: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
    marginLeft: 8,
  },
  actionBtn: {
    padding: 4,
  },
  actionIcon: {
    fontSize: 14,
  },
});
