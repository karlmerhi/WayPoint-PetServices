import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox, Icon } from 'react-native-paper';
import { Todo as TodoModel } from '../models/Todo';
import TodoService from '../services/TodoService';
import { formatDate } from '../utils/dateUtils';

interface TodoProps {
  todo: TodoModel;
  onPress?: (todo: TodoModel) => void;
}

const PriorityColors = {
  high: '#FF6B6B',
  medium: '#FFD166',
  low: '#06D6A0',
};

export const Todo: React.FC<TodoProps> = ({ todo, onPress }) => {
  const handleToggleComplete = async () => {
    try {
      await TodoService.updateTodo(todo.id, { completed: !todo.completed });
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    }
  };

  const priorityColor = PriorityColors[todo.priority] || PriorityColors.low;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress?.(todo)}
    >
      <View style={styles.leftSection}>
        <Checkbox
          status={todo.completed ? 'checked' : 'unchecked'}
          onPress={handleToggleComplete}
        />
      </View>
      
      <View style={styles.contentSection}>
        <Text style={[
          styles.title, 
          todo.completed && styles.completedText
        ]}>
          {todo.title}
        </Text>
        
        {todo.description ? (
          <Text 
            style={[styles.description, todo.completed && styles.completedText]}
            numberOfLines={2}
          >
            {todo.description}
          </Text>
        ) : null}
        
        <View style={styles.metaContainer}>
          {todo.dueDate ? (
            <View style={styles.metaItem}>
              <Icon source="calendar" size={14} />
              <Text style={styles.metaText}>
                {formatDate(todo.dueDate.toDate())}
              </Text>
            </View>
          ) : null}
          
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
            <Text style={styles.priorityText}>{todo.priority}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  leftSection: {
    marginRight: 10,
    justifyContent: 'center',
  },
  contentSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default Todo; 