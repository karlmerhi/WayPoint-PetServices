import React from 'react';
import { ActivityIndicator, View, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  style?: ViewStyle;
}

export function LoadingIndicator({
  size = 'large',
  color,
  message,
  fullScreen = false,
  overlay = false,
  style,
}: LoadingIndicatorProps) {
  const defaultColor = useThemeColor({}, 'accent');
  const indicatorColor = color || defaultColor;
  
  // Determine container style based on props
  const containerStyle = [
    styles.container,
    fullScreen && styles.fullScreen,
    overlay && styles.overlay,
    style,
  ];
  
  return (
    <View style={containerStyle}>
      <ActivityIndicator
        size={size}
        color={indicatorColor}
        style={styles.indicator}
      />
      
      {message && (
        <ThemedText style={styles.message}>
          {message}
        </ThemedText>
      )}
    </View>
  );
}

// Preset for inline loading
LoadingIndicator.Inline = (props: Omit<LoadingIndicatorProps, 'fullScreen' | 'overlay'>) => (
  <LoadingIndicator
    size="small"
    {...props}
    style={[styles.inline, props.style]}
  />
);

// Preset for full-screen loading with overlay
LoadingIndicator.FullScreen = (props: Omit<LoadingIndicatorProps, 'fullScreen' | 'overlay'>) => (
  <LoadingIndicator
    fullScreen
    overlay
    message={props.message || 'Loading...'}
    {...props}
  />
);

// Preset for loading that replaces content in a specific area
LoadingIndicator.Content = (props: Omit<LoadingIndicatorProps, 'fullScreen' | 'overlay'>) => (
  <LoadingIndicator
    message={props.message || 'Loading...'}
    {...props}
    style={[styles.content, props.style]}
  />
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
  indicator: {
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    marginTop: 8,
  },
  inline: {
    flexDirection: 'row',
    padding: 0,
  },
  content: {
    minHeight: 200,
  },
}); 