import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNetwork } from '../../app/context/NetworkContext';
import { useEffect, useRef } from 'react';

export const OfflineIndicator: React.FC = () => {
  const { isConnected } = useNetwork();
  const translateY = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isConnected ? -50 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isConnected, translateY]);

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY }] }
      ]}
    >
      <Text style={styles.text}>You are offline</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ff4d4f',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OfflineIndicator; 