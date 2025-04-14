import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Todo from './Todo';

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
}

interface TodoListProps {
  todos: TodoItem[];
  isLoading?: boolean;
  onToggleTodo: (id: string, completed: boolean) => void;
  onDeleteTodo?: (id: string) => void;
  onEditTodo?: (todo: TodoItem) => void;
}

const TodoList = ({ 
  todos, 
  isLoading = false, 
  onToggleTodo,
  onDeleteTodo,
  onEditTodo
}: TodoListProps) => {
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (todos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No todos found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Todo
          todo={item}
          onToggle={(completed) => onToggleTodo(item.id, completed)}
          onDelete={onDeleteTodo ? () => onDeleteTodo(item.id) : undefined}
          onEdit={onEditTodo ? () => onEditTodo(item) : undefined}
        />
      )}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  listContent: {
    paddingVertical: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default TodoList; 