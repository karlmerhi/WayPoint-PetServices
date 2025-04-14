// import { v4 as uuid } from 'uuid';
import NetInfo from '@react-native-community/netinfo';
import { storeData, getData, removeData, getAllKeys } from './storage';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

/**
 * Generate a simple UUID-like identifier that works in all environments
 * This approach doesn't rely on crypto APIs which can be problematic in React Native
 */
function generateId(): string {
  // Simple timestamp-based prefix
  const timestamp = new Date().getTime().toString(36);
  
  // Random component
  const randomPart = Math.random().toString(36).substring(2, 10);
  
  // Combine them for uniqueness
  return `${timestamp}-${randomPart}`;
}

/**
 * Types for sync operations
 */
export type SyncOperation = 'create' | 'update' | 'delete';

export interface SyncItem {
  id: string;
  collection: string;
  docId: string;
  operation: SyncOperation;
  data: any;
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  retryCount: number;
}

export interface SyncStats {
  pendingCount: number;
  failedCount: number;
  completedCount: number;
  lastSyncAttempt: Date | null;
  lastSuccessfulSync: Date | null;
  isSyncing: boolean;
}

const SYNC_QUEUE_KEY = 'sync_queue';
const MAX_RETRY_COUNT = 3;

/**
 * Sync Engine for handling offline data synchronization
 */
export class SyncEngine {
  private queue: SyncItem[] = [];
  private isSyncing: boolean = false;
  private networkStatus: 'connected' | 'disconnected' | 'unknown' = 'unknown';
  private listeners: Set<() => void> = new Set();

  /**
   * Initialize the Sync Engine
   * Loads the existing queue from AsyncStorage and sets up network listeners
   */
  public async initialize(): Promise<void> {
    try {
      // Load existing queue from AsyncStorage
      const storedQueue = await getData<SyncItem[]>(SYNC_QUEUE_KEY, []);
      if (storedQueue) {
        this.queue = storedQueue;
      }

      // Set up network listeners
      NetInfo.addEventListener(state => {
        const isConnected = state.isConnected && state.isInternetReachable !== false;
        this.networkStatus = isConnected ? 'connected' : 'disconnected';
        
        // If we're connected and have pending items, try to process queue
        if (isConnected && this.queue.filter(item => item.status === 'pending').length > 0) {
          this.processQueue();
        }
        
        // Notify listeners of network status change
        this.notifyListeners();
      });
      
      // Initial network check
      const initialState = await NetInfo.fetch();
      this.networkStatus = (initialState.isConnected && initialState.isInternetReachable !== false) 
        ? 'connected' 
        : 'disconnected';
    } catch (error) {
      console.error('Failed to initialize sync engine:', error);
    }
  }

  /**
   * Track a change for synchronization
   * @param collection Firestore collection name
   * @param docId Document ID
   * @param operation Type of operation (create, update, delete)
   * @param data Data to sync (for create/update operations)
   * @returns The created sync item
   */
  public trackChange(
    collection: string,
    docId: string,
    operation: SyncOperation,
    data?: any
  ): SyncItem {
    try {
      // Create the sync item with our safe ID generator
      const syncItem: SyncItem = {
        id: generateId(),
        collection,
        docId,
        operation,
        data: operation !== 'delete' ? data : null,
        timestamp: Date.now(),
        status: 'pending',
        retryCount: 0,
      };

      // Add to queue and persist
      this.queue.push(syncItem);
      this.persistQueue();

      // If online, try to sync immediately
      if (this.networkStatus === 'connected') {
        this.processQueue();
      }

      return syncItem;
    } catch (error) {
      // Handle any errors during item creation
      console.error('Error tracking change:', error);
      
      // Return a fallback item with error status
      const errorItem: SyncItem = {
        id: `error-${Date.now()}`,
        collection,
        docId,
        operation,
        data: null,
        timestamp: Date.now(),
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
        retryCount: 0
      };
      
      this.queue.push(errorItem);
      this.persistQueue();
      
      return errorItem;
    }
  }

  /**
   * Process the sync queue
   * @param forceAll Whether to force processing of all items regardless of status
   */
  public async processQueue(forceAll: boolean = false): Promise<void> {
    // Don't process if already syncing or offline
    if (this.isSyncing || this.networkStatus !== 'connected') {
      return;
    }

    this.isSyncing = true;
    const stats: SyncStats = this.getStats();
    stats.isSyncing = true;
    stats.lastSyncAttempt = new Date();
    this.notifyListeners();

    try {
      let hasSuccessfulSync = false;
      
      // Filter items to process (pending or failed + forced)
      const itemsToProcess = this.queue.filter(
        item => item.status === 'pending' || (forceAll && item.status === 'failed')
      );

      // Process each item
      for (const item of itemsToProcess) {
        try {
          item.status = 'processing';
          this.persistQueue();
          
          // Here we would integrate with Firebase to perform the actual sync
          // For now, we'll simulate a successful sync with a delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // In a real implementation, different operations would be handled differently:
          // if (item.operation === 'create') { /* create doc in Firestore */ }
          // if (item.operation === 'update') { /* update doc in Firestore */ }
          // if (item.operation === 'delete') { /* delete doc from Firestore */ }
          
          // Mark as completed
          item.status = 'completed';
          hasSuccessfulSync = true;
        } catch (error) {
          // Handle failure
          item.status = 'failed';
          item.error = error instanceof Error ? error.message : String(error);
          item.retryCount += 1;
          
          // If max retries reached, we might want to log this or alert the user
          if (item.retryCount >= MAX_RETRY_COUNT) {
            console.error(`Max retries reached for sync item: ${item.id}, collection: ${item.collection}, docId: ${item.docId}`);
          }
        }
        
        // Persist changes after each item
        this.persistQueue();
      }
      
      // Update successful sync timestamp if needed
      if (hasSuccessfulSync) {
        stats.lastSuccessfulSync = new Date();
      }
      
      // Clean up completed items after a while
      this.cleanupCompletedItems();
    } catch (error) {
      console.error('Error processing sync queue:', error);
    } finally {
      this.isSyncing = false;
      stats.isSyncing = false;
      this.notifyListeners();
    }
  }

  /**
   * Clean up completed items from the queue
   * @param maxAge Maximum age in ms before removing completed items (default 7 days)
   */
  private cleanupCompletedItems(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    this.queue = this.queue.filter(
      item => item.status !== 'completed' || (now - item.timestamp) < maxAge
    );
    this.persistQueue();
  }

  /**
   * Persist the queue to AsyncStorage
   */
  private async persistQueue(): Promise<void> {
    try {
      await storeData(SYNC_QUEUE_KEY, this.queue);
    } catch (error) {
      console.error('Failed to persist sync queue:', error);
    }
  }

  /**
   * Get statistics about the sync queue
   */
  public getStats(): SyncStats {
    const pendingCount = this.queue.filter(item => item.status === 'pending').length;
    const failedCount = this.queue.filter(item => item.status === 'failed').length;
    const completedCount = this.queue.filter(item => item.status === 'completed').length;
    
    return {
      pendingCount,
      failedCount,
      completedCount,
      lastSyncAttempt: null,
      lastSuccessfulSync: null,
      isSyncing: this.isSyncing,
    };
  }

  /**
   * Get all pending items in the queue
   */
  public getPendingItems(): SyncItem[] {
    return this.queue.filter(item => item.status === 'pending');
  }

  /**
   * Get all failed items in the queue
   */
  public getFailedItems(): SyncItem[] {
    return this.queue.filter(item => item.status === 'failed');
  }

  /**
   * Reset failed items to pending status for retry
   */
  public retryFailedItems(): void {
    this.queue.forEach(item => {
      if (item.status === 'failed') {
        item.status = 'pending';
        item.error = undefined;
      }
    });
    
    this.persistQueue();
    
    // Try to process immediately if online
    if (this.networkStatus === 'connected') {
      this.processQueue();
    }
  }

  /**
   * Clear the entire sync queue
   * Should be used with caution - can result in data loss
   */
  public async clearQueue(): Promise<void> {
    this.queue = [];
    await this.persistQueue();
  }

  /**
   * Add a listener that will be called when the sync state changes
   */
  public addListener(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Manually add a sync item to the queue
   * This is useful for testing or for creating items without UUID generation
   */
  public addItemManually(item: SyncItem): void {
    try {
      this.queue.push(item);
      this.persistQueue();
      
      // If online, try to sync immediately
      if (this.networkStatus === 'connected') {
        this.processQueue();
      }
      
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to manually add item:', error);
    }
  }
}

// Create a singleton instance of the sync engine
export const syncEngine = new SyncEngine();

// Initialize the sync engine when the module is imported
syncEngine.initialize().catch(error => {
  console.error('Failed to initialize sync engine:', error);
});

/**
 * Hook for accessing the sync engine state in components
 */
export function useSyncEngine() {
  const { isConnected } = useNetworkStatus();
  
  return {
    trackChange: syncEngine.trackChange.bind(syncEngine),
    processQueue: syncEngine.processQueue.bind(syncEngine),
    retryFailedItems: syncEngine.retryFailedItems.bind(syncEngine),
    getPendingItems: syncEngine.getPendingItems.bind(syncEngine),
    getFailedItems: syncEngine.getFailedItems.bind(syncEngine),
    clearQueue: syncEngine.clearQueue.bind(syncEngine),
    getStats: syncEngine.getStats.bind(syncEngine),
    addListener: syncEngine.addListener.bind(syncEngine),
    addItemManually: syncEngine.addItemManually.bind(syncEngine),
    isConnected,
  };
} 