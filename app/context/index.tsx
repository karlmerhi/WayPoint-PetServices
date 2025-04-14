/**
 * This file re-exports all contexts with a default export 
 * to prevent Expo Router warnings about missing default exports.
 */

import { AuthProvider, useAuth } from './AuthContext';
import { NetworkProvider, useNetworkStatus } from './NetworkContext';

// Export all contexts individually
export { 
  AuthProvider, 
  useAuth,
  NetworkProvider,
  useNetworkStatus 
};

// Default export for preventing Expo Router warnings
export default {
  AuthProvider,
  useAuth,
  NetworkProvider,
  useNetworkStatus
}; 