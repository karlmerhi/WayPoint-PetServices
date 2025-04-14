import { FirestoreCollection } from '../utils/db';
import { Todo, TODOS_COLLECTION } from '../models/Todo';
import { auth } from '../firebase';

class TodoService {
  private todoCollection: FirestoreCollection<Todo>;
  
  constructor() {
    this.todoCollection = new FirestoreCollection<Todo>(TODOS_COLLECTION);
  }

  async getTodos() {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    
    return this.todoCollection.query(ref => 
      ref.where('userId', '==', userId)
    );
  }

  async getTodo(id: string) {
    return this.todoCollection.getById(id);
  }

  async createTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    
    // The createAt and updatedAt fields will be added by the create method
    return this.todoCollection.create({
      ...todo,
      userId,
    } as any);
  }

  async updateTodo(id: string, data: Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>) {
    return this.todoCollection.update(id, data);
  }

  async deleteTodo(id: string) {
    return this.todoCollection.delete(id);
  }

  subscribeTodos(callback: (todos: Todo[]) => void) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    
    // Use a custom query that filters by userId
    return this.todoCollection.subscribe(
      (todos) => {
        // Local filter since subscribe doesn't support filtering directly
        const filteredTodos = todos.filter(todo => todo.userId === userId);
        callback(filteredTodos);
      }
    );
  }

  subscribeTodo(id: string, callback: (todo: Todo | null) => void) {
    return this.todoCollection.subscribeToDocument(id, callback);
  }
}

export default new TodoService(); 