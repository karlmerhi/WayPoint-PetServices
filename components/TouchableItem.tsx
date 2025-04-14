import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableOpacityProps,
  TouchableNativeFeedbackProps,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

type TouchableItemProps = (TouchableOpacityProps | TouchableNativeFeedbackProps) & {
  children: React.ReactNode;
  rippleColor?: string;
  borderless?: boolean;
  useForeground?: boolean;
  background?: any; // TouchableNativeFeedback.Background
  style?: any;
  pressColor?: string;
  pressOpacity?: number;
};

/**
 * TouchableItem renders a touchable cross-platform View that looks native on both iOS and Android.
 *
 * It provides a proper feedback when pressed using opacity on iOS and a ripple effect on Android.
 */
export function TouchableItem({
  children,
  style,
  rippleColor,
  borderless = false,
  useForeground = true,
  background,
  pressColor,
  pressOpacity = 0.7,
  ...rest
}: TouchableItemProps) {
  const accentColor = useThemeColor({}, 'accent');
  
  // Determine ripple color (Android)
  const getRippleColor = () => {
    if (rippleColor) return rippleColor;
    return accentColor;
  };

  /*
   * TouchableNativeFeedback.Ripple causes a crash on older Android versions,
   * therefore only enable it on Android 21+
   */
  if (
    Platform.OS === 'android' &&
    Platform.Version >= 21
  ) {
    const defaultRippleBackground = TouchableNativeFeedback.Ripple(
      getRippleColor(),
      borderless
    );
    
    const touchableBackground = background || defaultRippleBackground;

    return (
      <TouchableNativeFeedback
        {...rest}
        useForeground={useForeground}
        background={touchableBackground}
      >
        <View style={[styles.wrapper, style]}>{children}</View>
      </TouchableNativeFeedback>
    );
  }

  // On iOS, use TouchableOpacity
  return (
    <TouchableOpacity
      {...rest}
      style={[styles.wrapper, style]}
      activeOpacity={pressOpacity}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
}); 