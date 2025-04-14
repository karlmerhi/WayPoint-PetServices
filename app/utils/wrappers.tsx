import React from 'react';
import { View, Text } from 'react-native';

/**
 * This file contains wrapper components for non-component files that
 * are erroneously treated as routes by Expo Router and cause warnings 
 * about missing default exports.
 * 
 * In production, these should be properly excluded from the routing system
 * using the metro.config.js file's 'blockList' configuration.
 */

// A simple component that does nothing but satisfy the default export requirement
function EmptyComponent() {
  return null;
}

// Wrapped versions of utility files
export const WrappedFiles = {
  // Config files
  'firestore.ts': EmptyComponent,
  
  // Context files (these should already have default exports, but this is a backup)
  'AuthContext.tsx': EmptyComponent,
  'NetworkContext.tsx': EmptyComponent,
  
  // Model files
  'Todo.ts': EmptyComponent,
  
  // Utility files
  'dateUtils.ts': EmptyComponent,
  'db.ts': EmptyComponent,
  'firebase-admin.ts': EmptyComponent,
  'firebase-utils.ts': EmptyComponent,
  'storage.ts': EmptyComponent,
  'syncEngine.ts': EmptyComponent,
  
  // Firebase configuration
  'firebase.ts': EmptyComponent,
};

// Default export to prevent this file itself from causing warnings
export default EmptyComponent; 