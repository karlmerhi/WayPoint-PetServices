import React, { forwardRef, useState } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  TouchableOpacity,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  onLeftIconPress?: () => void;
  containerStyle?: object;
  helperText?: string;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      onRightIconPress,
      onLeftIconPress,
      containerStyle,
      helperText,
      style,
      placeholder,
      value,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    
    const inputBackgroundColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const placeholderTextColor = useThemeColor({}, 'placeholderText');
    const accentColor = useThemeColor({}, 'accent');
    const errorColor = '#E53935'; // Consistent with danger button
    
    const handleFocus = (e: any) => {
      setIsFocused(true);
      if (onFocus) {
        onFocus(e);
      }
    };
    
    const handleBlur = (e: any) => {
      setIsFocused(false);
      if (onBlur) {
        onBlur(e);
      }
    };
    
    // Determine border color based on state
    const getBorderColor = () => {
      if (error) return errorColor;
      if (isFocused) return accentColor;
      return 'transparent';
    };
    
    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <ThemedText style={styles.label}>{label}</ThemedText>
        )}
        
        <View style={[
          styles.inputContainer,
          { 
            backgroundColor: inputBackgroundColor,
            borderColor: getBorderColor(),
          },
          isFocused && styles.focused,
        ]}>
          {leftIcon && (
            <TouchableOpacity
              disabled={!onLeftIconPress}
              onPress={onLeftIconPress}
              style={styles.leftIcon}
            >
              {leftIcon}
            </TouchableOpacity>
          )}
          
          <RNTextInput
            ref={ref}
            style={[
              styles.input,
              { color: textColor },
              leftIcon && styles.inputWithLeftIcon,
              rightIcon && styles.inputWithRightIcon,
              style,
            ]}
            placeholderTextColor={placeholderTextColor}
            placeholder={placeholder}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />
          
          {rightIcon && (
            <TouchableOpacity
              disabled={!onRightIconPress}
              onPress={onRightIconPress}
              style={styles.rightIcon}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
        
        {(error || helperText) && (
          <ThemedText
            style={[
              styles.helperText,
              error && { color: errorColor },
            ]}
          >
            {error || helperText}
          </ThemedText>
        )}
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    paddingLeft: 16,
    marginRight: 8,
  },
  rightIcon: {
    paddingRight: 16,
    marginLeft: 8,
  },
  focused: {
    borderWidth: 2,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
}); 