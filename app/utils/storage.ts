import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage wrapper for consistent data persistence
 * Provides type-safe methods for storing and retrieving data
 */

// Prefix for all keys to avoid collisions
const KEY_PREFIX = 'waypoint:';

/**
 * Storage error with additional context
 */
class StorageError extends Error {
  operation: string;
  key?: string;

  constructor(message: string, operation: string, key?: string) {
    super(message);
    this.name = 'StorageError';
    this.operation = operation;
    this.key = key;
  }
}

/**
 * Store a value in AsyncStorage with proper serialization
 * @param key Storage key
 * @param value Value to store (will be JSON serialized)
 */
export async function storeData<T>(key: string, value: T): Promise<void> {
  try {
    const prefixedKey = `${KEY_PREFIX}${key}`;
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(prefixedKey, jsonValue);
  } catch (error) {
    console.error(`Failed to store data for key: ${key}`, error);
    throw new StorageError(
      `Failed to store data: ${error instanceof Error ? error.message : String(error)}`,
      'storeData',
      key
    );
  }
}

/**
 * Retrieve a value from AsyncStorage with proper deserialization
 * @param key Storage key
 * @param defaultValue Optional default value if key doesn't exist
 * @returns The stored value or defaultValue if not found
 */
export async function getData<T>(key: string, defaultValue?: T): Promise<T | null | undefined> {
  try {
    const prefixedKey = `${KEY_PREFIX}${key}`;
    const jsonValue = await AsyncStorage.getItem(prefixedKey);
    
    if (jsonValue === null) {
      return defaultValue ?? null;
    }
    
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    console.error(`Failed to retrieve data for key: ${key}`, error);
    throw new StorageError(
      `Failed to retrieve data: ${error instanceof Error ? error.message : String(error)}`,
      'getData',
      key
    );
  }
}

/**
 * Remove a value from AsyncStorage
 * @param key Storage key
 */
export async function removeData(key: string): Promise<void> {
  try {
    const prefixedKey = `${KEY_PREFIX}${key}`;
    await AsyncStorage.removeItem(prefixedKey);
  } catch (error) {
    console.error(`Failed to remove data for key: ${key}`, error);
    throw new StorageError(
      `Failed to remove data: ${error instanceof Error ? error.message : String(error)}`,
      'removeData',
      key
    );
  }
}

/**
 * Check if a key exists in AsyncStorage
 * @param key Storage key
 * @returns Boolean indicating if the key exists
 */
export async function hasData(key: string): Promise<boolean> {
  try {
    const prefixedKey = `${KEY_PREFIX}${key}`;
    const value = await AsyncStorage.getItem(prefixedKey);
    return value !== null;
  } catch (error) {
    console.error(`Failed to check if key exists: ${key}`, error);
    throw new StorageError(
      `Failed to check data existence: ${error instanceof Error ? error.message : String(error)}`,
      'hasData',
      key
    );
  }
}

/**
 * Store multiple key-value pairs in AsyncStorage
 * @param items Array of key-value pairs to store
 */
export async function multiStoreData(items: Array<[string, any]>): Promise<void> {
  try {
    const prefixedItems = items.map(([key, value]) => [
      `${KEY_PREFIX}${key}`,
      JSON.stringify(value)
    ]);
    
    await AsyncStorage.multiSet(prefixedItems as Array<[string, string]>);
  } catch (error) {
    console.error('Failed to store multiple data items', error);
    throw new StorageError(
      `Failed to store multiple data items: ${error instanceof Error ? error.message : String(error)}`,
      'multiStoreData'
    );
  }
}

/**
 * Retrieve multiple values from AsyncStorage
 * @param keys Array of keys to retrieve
 * @returns Object with key-value pairs of retrieved data
 */
export async function multiGetData<T extends Record<string, any>>(keys: string[]): Promise<Partial<T>> {
  try {
    const prefixedKeys = keys.map(key => `${KEY_PREFIX}${key}`);
    const results = await AsyncStorage.multiGet(prefixedKeys);
    
    return results.reduce((acc, [prefixedKey, value]) => {
      if (value === null) return acc;
      
      const key = prefixedKey.replace(KEY_PREFIX, '');
      try {
        acc[key as keyof T] = JSON.parse(value);
      } catch (e) {
        console.warn(`Could not parse JSON for key ${key}`, e);
        acc[key as keyof T] = value as any;
      }
      return acc;
    }, {} as Partial<T>);
  } catch (error) {
    console.error('Failed to retrieve multiple data items', error);
    throw new StorageError(
      `Failed to retrieve multiple data items: ${error instanceof Error ? error.message : String(error)}`,
      'multiGetData'
    );
  }
}

/**
 * Remove multiple keys from AsyncStorage
 * @param keys Array of keys to remove
 */
export async function multiRemoveData(keys: string[]): Promise<void> {
  try {
    const prefixedKeys = keys.map(key => `${KEY_PREFIX}${key}`);
    await AsyncStorage.multiRemove(prefixedKeys);
  } catch (error) {
    console.error('Failed to remove multiple data items', error);
    throw new StorageError(
      `Failed to remove multiple data items: ${error instanceof Error ? error.message : String(error)}`,
      'multiRemoveData'
    );
  }
}

/**
 * Clear all data stored by this app
 * Only removes keys with the app's prefix
 */
export async function clearAllData(): Promise<void> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const appKeys = allKeys.filter(key => key.startsWith(KEY_PREFIX));
    await AsyncStorage.multiRemove(appKeys);
  } catch (error) {
    console.error('Failed to clear all data', error);
    throw new StorageError(
      `Failed to clear all data: ${error instanceof Error ? error.message : String(error)}`,
      'clearAllData'
    );
  }
}

/**
 * Get all keys stored by this app
 * Only returns keys with the app's prefix, with the prefix removed
 */
export async function getAllKeys(): Promise<string[]> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    return allKeys
      .filter(key => key.startsWith(KEY_PREFIX))
      .map(key => key.replace(KEY_PREFIX, ''));
  } catch (error) {
    console.error('Failed to get all keys', error);
    throw new StorageError(
      `Failed to get all keys: ${error instanceof Error ? error.message : String(error)}`,
      'getAllKeys'
    );
  }
} 