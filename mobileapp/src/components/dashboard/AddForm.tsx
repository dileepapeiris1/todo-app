/** Modal form for creating a new task. */

import {
  KeyboardAvoidingView, Modal, Platform, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useState } from 'react';
import { TITLE_MAX_LENGTH, DESC_MAX_LENGTH } from '@/constants/validation';
import { nowDateTimeLocal } from '@/utils/date';
import type { CreateTodoRequest } from '@/types/requests';

interface Props {
  visible:  boolean;
  onAdd:    (data: CreateTodoRequest) => void;
  onCancel: () => void;
  busy?:    boolean;
}

export function AddForm({ visible, onAdd, onCancel, busy = false }: Props) {
  const [title,   setTitle]   = useState('');
  const [desc,    setDesc]    = useState('');

  function submit() {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: desc.trim() || undefined });
    setTitle('');
    setDesc('');
  }

  function cancel() {
    setTitle('');
    setDesc('');
    onCancel();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={cancel}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.heading}>Add task</Text>

          <TextInput
            style={styles.titleInput}
            placeholder="Task name"
            placeholderTextColor="#cbd5e1"
            value={title}
            onChangeText={t => setTitle(t.slice(0, TITLE_MAX_LENGTH))}
            autoFocus
            editable={!busy}
            returnKeyType="next"
          />

          <TextInput
            style={styles.descInput}
            placeholder="Description (optional)"
            placeholderTextColor="#cbd5e1"
            value={desc}
            onChangeText={t => setDesc(t.slice(0, DESC_MAX_LENGTH))}
            multiline
            numberOfLines={3}
            editable={!busy}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={cancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addBtn, (!title.trim() || busy) && styles.addBtnDisabled]}
              onPress={submit}
              disabled={!title.trim() || busy}
            >
              <Text style={styles.addText}>Add task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e2e8f0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 15,
    color: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 8,
    marginBottom: 12,
  },
  descInput: {
    fontSize: 13,
    color: '#475569',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 72,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  addBtn: {
    flex: 1,
    backgroundColor: '#e44332',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addBtnDisabled: {
    opacity: 0.4,
  },
  addText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});
