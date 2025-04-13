import React from "react";
import { Pressable, PressableProps } from "react-native";
import * as Haptics from "expo-haptics";

interface HapticTabProps extends PressableProps {
  onPress?: () => void;
}

/**
 * A tab component that provides haptic feedback when pressed
 */
export function HapticTab({ onPress, children, ...props }: HapticTabProps) {
  const handlePress = () => {
    // Light impact feedback for tab press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress} {...props}>
      {children}
    </Pressable>
  );
}
