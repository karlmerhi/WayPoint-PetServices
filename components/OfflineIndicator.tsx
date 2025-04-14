import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { ThemedText } from './ThemedText';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { MaterialIcons } from '@expo/vector-icons';

interface OfflineIndicatorProps {
  message?: string;
  position?: 'top' | 'bottom';
}

export function OfflineIndicator({
  message = 'No internet connection',
  position = 'top',
}: OfflineIndicatorProps) {
  const [isOffline, setIsOffline] = useState(false);
  const [opacity] = useState(new Animated.Value(0));
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);

  useEffect(() => {
    // Subscribe to network status changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      
      if (offline !== isOffline) {
        // If transitioning from online to offline, store the time
        if (!offline && isOffline) {
          setLastOnlineTime(new Date());
        }
        
        setIsOffline(offline);
        
        // Animate the indicator
        Animated.timing(opacity, {
          toValue: offline ? 1 : 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      }
    });

    // Initial check
    NetInfo.fetch().then((state: NetInfoState) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setIsOffline(offline);
      
      // Set initial opacity without animation
      opacity.setValue(offline ? 1 : 0);
    });

    return () => {
      unsubscribe();
    };
  }, [isOffline]);

  // Don't render anything if online
  if (!isOffline) {
    return null;
  }

  // Format the last online time if available
  const getLastOnlineText = () => {
    if (!lastOnlineTime) return '';
    
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastOnlineTime.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Last connected just now';
    if (diffMinutes === 1) return 'Last connected 1 minute ago';
    if (diffMinutes < 60) return `Last connected ${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return 'Last connected 1 hour ago';
    return `Last connected ${diffHours} hours ago`;
  };

  // Calculate position styles
  const positionStyle = position === 'top' 
    ? styles.topPosition 
    : styles.bottomPosition;

  return (
    <Animated.View style={[styles.container, positionStyle, { opacity }]}>
      <MaterialIcons name="wifi-off" size={18} color="#fff" style={styles.icon} />
      <View style={styles.textContainer}>
        <ThemedText style={styles.message}>{message}</ThemedText>
        {lastOnlineTime && (
          <ThemedText style={styles.lastOnline}>{getLastOnlineText()}</ThemedText>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    padding: 12,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999,
  },
  topPosition: {
    top: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  bottomPosition: {
    bottom: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  icon: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    color: '#fff',
    fontWeight: '500',
  },
  lastOnline: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
}); 