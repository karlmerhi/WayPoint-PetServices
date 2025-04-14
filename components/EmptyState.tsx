import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { ThemedText } from './ThemedText';
import { Button } from './Button';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: string; // MaterialIcons name
  iconSize?: number;
  image?: ImageSourcePropType;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'default' | 'error' | 'search' | 'no-items';
}

export function EmptyState({
  title,
  message,
  icon,
  iconSize = 64,
  image,
  actionLabel,
  onAction,
  type = 'default',
}: EmptyStateProps) {
  const iconColor = useThemeColor({}, 'accent');
  const textColor = useThemeColor({}, 'text');
  
  // If no specific icon is provided, select based on type
  const getIconName = (): string => {
    if (icon) return icon;
    
    switch (type) {
      case 'error':
        return 'error-outline';
      case 'search':
        return 'search';
      case 'no-items':
        return 'inbox';
      default:
        return 'info-outline';
    }
  };
  
  // Determine if we should show a button
  const showAction = actionLabel && onAction;
  
  return (
    <View style={styles.container}>
      {image ? (
        <Image source={image} style={styles.image} resizeMode="contain" />
      ) : (
        <MaterialIcons
          name={getIconName()}
          size={iconSize}
          color={iconColor}
          style={styles.icon}
        />
      )}
      
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      
      {message && (
        <ThemedText style={styles.message}>
          {message}
        </ThemedText>
      )}
      
      {showAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          style={styles.button}
        />
      )}
    </View>
  );
}

// Pre-configured empty states for common scenarios
EmptyState.NoResults = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    title="No results found"
    message="Try using different search terms or filters."
    type="search"
    {...props}
  />
);

EmptyState.NoItems = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    title="No items yet"
    message="Items you add will appear here."
    type="no-items"
    {...props}
  />
);

EmptyState.Error = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    title="Something went wrong"
    message="We couldn't load your data. Please try again."
    type="error"
    actionLabel="Try Again"
    {...props}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 24,
    opacity: 0.8,
  },
  button: {
    minWidth: 120,
  },
}); 