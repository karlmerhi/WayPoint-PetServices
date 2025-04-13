import { useContext, createContext } from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks/useThemeColor";

// Context to store tab bar overflow value
const TabBarOverflowContext = createContext<number>(0);

/**
 * Hook to get the bottom tab overflow value
 * This is used to properly adjust scroll content to account for the tab bar
 */
export function useBottomTabOverflow(): number {
  return useContext(TabBarOverflowContext);
}

interface TabBarBackgroundProps extends ViewProps {
  height?: number;
}

/**
 * Background component for the tab bar that handles safe area insets
 * and provides tab overflow context for content adjustment
 */
export function TabBarBackground({
  height = 49,
  style,
  children,
  ...props
}: TabBarBackgroundProps) {
  const { bottom } = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, "background");

  // Calculate the total height with bottom inset
  const totalHeight = height + bottom;

  return (
    <TabBarOverflowContext.Provider value={totalHeight}>
      <View
        style={[
          styles.container,
          { backgroundColor, height: totalHeight, paddingBottom: bottom },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    </TabBarOverflowContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
});
