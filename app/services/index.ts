/**
 * This file re-exports all services with a default export 
 * to prevent Expo Router warnings about missing default exports.
 */

import TodoService from './TodoService';
import * as firestoreService from './firestore';

// Export all services individually
export { TodoService, firestoreService };

// Default export for preventing Expo Router warnings
export default {
  TodoService,
  firestoreService
}; 