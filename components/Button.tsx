import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';

export type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  ...rest
}: ButtonProps) {
  const primaryColor = useThemeColor({}, 'accent');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');
  const backgroundColor = useThemeColor({}, 'background');
  
  // Determine background color based on variant
  const getBackgroundColor = () => {
    if (disabled) return '#CCCCCC';
    
    switch (variant) {
      case 'primary':
        return primaryColor;
      case 'secondary':
        return cardColor;
      case 'danger':
        return '#E53935';
      default:
        return primaryColor;
    }
  };
  
  // Determine text color based on variant
  const getTextColor = () => {
    if (disabled) return '#666666';
    
    switch (variant) {
      case 'primary':
        return '#ffffff';
      case 'secondary':
        return textColor;
      case 'danger':
        return '#ffffff';
      default:
        return '#ffffff';
    }
  };
  
  // Determine size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };
  
  // Determine text size
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getSizeStyles(),
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...rest}
    >
      <View style={styles.contentContainer}>
        {leftIcon && !isLoading && (
          <View style={styles.leftIconContainer}>{leftIcon}</View>
        )}
        
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'secondary' ? primaryColor : '#ffffff'}
          />
        ) : (
          <ThemedText
            style={[
              styles.buttonText,
              { color: getTextColor(), fontSize: getTextSize() },
            ]}
          >
            {title}
          </ThemedText>
        )}
        
        {rightIcon && !isLoading && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  leftIconContainer: {
    marginRight: 8,
  },
  rightIconContainer: {
    marginLeft: 8,
  },
}); 