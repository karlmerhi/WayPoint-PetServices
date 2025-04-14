/**
 * This file re-exports all utility functions with default exports 
 * to prevent Expo Router warnings about missing default exports.
 */

import * as dateUtils from './dateUtils';
import * as db from './db';
import * as firebaseAdmin from './firebase-admin';
import * as firebaseUtils from './firebase-utils';
import * as storage from './storage';
import * as syncEngine from './syncEngine';

// Add default exports for all utils
export { dateUtils as default };

// Named exports for convenient imports
export {
  dateUtils,
  db,
  firebaseAdmin,
  firebaseUtils,
  storage,
  syncEngine
}; 