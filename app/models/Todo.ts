import { Timestamp } from 'firebase/firestore';
import { BaseModel } from '../utils/db';

export interface Todo extends BaseModel {
  title: string;
  completed: boolean;
  description?: string;
  dueDate?: Timestamp;
  priority?: 'low' | 'medium' | 'high';
  userId: string;
  tags?: string[];
}

export const TODOS_COLLECTION = 'todos'; 