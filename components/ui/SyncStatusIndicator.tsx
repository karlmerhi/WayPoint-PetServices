import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useSyncEngine, SyncStats } from '@/app/utils/syncEngine';

export const SyncStatusIndicator: React.FC = () => {
  const syncEngine = useSyncEngine();
  const [stats, setStats] = useState<SyncStats>(syncEngine.getStats());
  const [visible, setVisible] = useState(false);
  const opacity = React.useRef(new Animated.Value(0)).current;

  // Update stats when sync state changes
  useEffect(() => {
    const unsubscribe = syncEngine.addListener(() => {
      setStats(syncEngine.getStats());
      
      // Show indicator if there are pending or failed items
      const hasItems = 
        syncEngine.getPendingItems().length > 0 || 
        syncEngine.getFailedItems().length > 0;
      
      if (hasItems && !visible) {
        setVisible(true);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (!hasItems && visible) {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setVisible(false);
        });
      }
    });
    
    // Initial check
    const initialStats = syncEngine.getStats();
    setStats(initialStats);
    
    const hasItems = 
      syncEngine.getPendingItems().length > 0 || 
      syncEngine.getFailedItems().length > 0;
    
    setVisible(hasItems);
    
    if (hasItems) {
      opacity.setValue(1);
    }
    
    return unsubscribe;
  }, []);

  // Don't render if no sync items
  if (!visible && !stats.isSyncing) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.content}>
        <Text style={styles.text}>
          {stats.isSyncing
            ? 'Syncing...'
            : `${stats.pendingCount} pending, ${stats.failedCount} failed`}
        </Text>
        
        {stats.failedCount > 0 && !stats.isSyncing && (
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => syncEngine.retryFailedItems()}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
        
        {(!stats.isSyncing && syncEngine.isConnected && stats.pendingCount > 0) && (
          <TouchableOpacity 
            style={styles.syncButton}
            onPress={() => syncEngine.processQueue()}
          >
            <Text style={styles.syncText}>Sync Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  syncButton: {
    backgroundColor: '#1890ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  syncText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SyncStatusIndicator; 