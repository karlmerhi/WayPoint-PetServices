import React, { forwardRef } from "react";
import { Pressable, PressableProps } from "react-native";
import * as Haptics from "expo-haptics";

interface HapticTabProps extends PressableProps {
  onPress?: () => void;
}

/**
 * A tab component that provides haptic feedback when pressed
 */
export const HapticTab = forwardRef<Pressable, HapticTabProps>(
  ({ onPress, children, ...props }, ref) => {
    const handlePress = () => {
      // Light impact feedback for tab press
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.();
    };

    return (
      <Pressable ref={ref} onPress={handlePress} {...props}>
        {children}
      </Pressable>
    );
  }
);
