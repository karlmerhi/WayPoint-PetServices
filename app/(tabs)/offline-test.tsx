import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import OfflineIndicator from '@/components/ui/OfflineIndicator';
import SyncStatusIndicator from '@/components/ui/SyncStatusIndicator';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useSyncEngine, SyncOperation, SyncItem } from '@/app/utils/syncEngine';

export default function OfflineTestScreen() {
  const { isOffline } = useNetworkStatus();
  const syncEngine = useSyncEngine();
  const [testLogs, setTestLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setTestLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
  };

  const simulateOperation = (operation: SyncOperation) => {
    try {
      const collections = ['customers', 'pets', 'appointments'];
      const collection = collections[Math.floor(Math.random() * collections.length)];
      const docId = `test-${Math.floor(Math.random() * 1000)}`;
      
      let data = null;
      if (operation !== 'delete') {
        data = {
          name: `Test ${operation} ${Math.floor(Math.random() * 100)}`,
          timestamp: new Date().toISOString(),
          testValue: Math.floor(Math.random() * 1000)
        };
      }
      
      const syncItem = syncEngine.trackChange(collection, docId, operation, data);
      
      if (syncItem.status === 'failed') {
        addLog(`Failed to create ${operation} operation: ${syncItem.error}`);
      } else {
        addLog(`Created ${operation} operation for ${collection}/${docId}`);
      }
    } catch (error) {
      // Catch any unexpected errors
      addLog(`Error during operation: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const clearLogs = () => {
    setTestLogs([]);
  };

  const toggleNetwork = async () => {
    try {
      // This is just a simulation - in a real app, we can't control network state
      addLog(`Note: This just simulates network changes, doesn't actually change connectivity`);
      
      // This would normally trigger our network listeners
      // For testing, use airplane mode on your device
      
      if (isOffline) {
        addLog('Network connectivity restored (simulated)');
      } else {
        addLog('Network connectivity lost (simulated)');
      }
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Add a simple test function that doesn't rely on UUID
  const createSimpleTestItem = () => {
    try {
      // Create a simple timestamp-based ID
      const testId = `manual-${Date.now()}`;
      const testItemData = {
        name: `Simple Test Item`,
        createdAt: new Date().toISOString(),
      };
      
      // Manually create and add a sync item
      const manualSyncItem: SyncItem = {
        id: testId,
        collection: 'test-items',
        docId: testId,
        operation: 'create',
        data: testItemData,
        timestamp: Date.now(),
        status: 'pending',
        retryCount: 0
      };
      
      // Use the sync engine's methods directly
      syncEngine.addItemManually(manualSyncItem);
      
      addLog(`Created simple test item with ID: ${testId}`);
    } catch (error) {
      addLog(`Error creating simple test item: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <OfflineIndicator />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.title}>Offline Functionality Test</ThemedText>
        
        <ThemedView style={styles.infoContainer}>
          <ThemedText>
            Network Status: {isOffline ? '🔴 Offline' : '🟢 Online'}
          </ThemedText>
          <ThemedText>
            Pending Sync Items: {syncEngine.getPendingItems().length}
          </ThemedText>
          <ThemedText>
            Failed Sync Items: {syncEngine.getFailedItems().length}
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.createButton]} 
            onPress={() => simulateOperation('create')}
          >
            <ThemedText style={styles.buttonText}>Create Item</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.updateButton]} 
            onPress={() => simulateOperation('update')}
          >
            <ThemedText style={styles.buttonText}>Update Item</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.deleteButton]} 
            onPress={() => simulateOperation('delete')}
          >
            <ThemedText style={styles.buttonText}>Delete Item</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#25292e' }]} 
            onPress={createSimpleTestItem}
          >
            <ThemedText style={styles.buttonText}>Create Simple Test Item</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.networkButton]} 
            onPress={toggleNetwork}
          >
            <ThemedText style={styles.buttonText}>
              Simulate {isOffline ? 'Online' : 'Offline'}
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.syncButton]} 
            onPress={() => {
              syncEngine.processQueue(true);
              addLog('Manually triggered sync');
            }}
          >
            <ThemedText style={styles.buttonText}>Force Sync</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.clearButton]} 
            onPress={() => {
              syncEngine.clearQueue();
              addLog('Cleared sync queue');
            }}
          >
            <ThemedText style={styles.buttonText}>Clear Queue</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.logContainer}>
          <ThemedView style={styles.logHeader}>
            <ThemedText type="subtitle">Test Logs</ThemedText>
            <TouchableOpacity onPress={clearLogs}>
              <ThemedText style={styles.clearText}>Clear</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          <ThemedView style={styles.logs}>
            {testLogs.length === 0 ? (
              <ThemedText style={styles.emptyLog}>No logs yet</ThemedText>
            ) : (
              testLogs.map((log, index) => (
                <ThemedText key={index} style={styles.logText}>{log}</ThemedText>
              ))
            )}
          </ThemedView>
        </ThemedView>
      </ScrollView>
      
      <SyncStatusIndicator />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#52c41a',
  },
  updateButton: {
    backgroundColor: '#1890ff',
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
  },
  networkButton: {
    backgroundColor: '#722ed1',
  },
  syncButton: {
    backgroundColor: '#faad14',
  },
  clearButton: {
    backgroundColor: '#8c8c8c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 8,
    maxHeight: 300,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  clearText: {
    color: '#1890ff',
  },
  logs: {
    padding: 8,
  },
  logText: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    marginBottom: 4,
  },
  emptyLog: {
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.4)',
  },
}); 