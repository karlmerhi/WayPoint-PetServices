import { Link, Tabs } from "expo-router";
import { Dimensions, StyleSheet } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";

/**
 * The native stack navigator is a static navigator that doesn't keep all screens in memory.
 * This is very important for memory usage and performance. It's the standard that has been
 * adopted by iOS and Android. Note that Expo Router is different from React Navigation in
 * that it doesn't have a separate native stack navigator. The native stack navigator is
 * built into it via a native code module.
 */
export default function TabLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const tabIconDefaultColor = useThemeColor({}, "tabIconDefault");
  const iconColor = useThemeColor({}, "icon");

  /**
   * Hack to re-render the Tabs component when the screen size changes.
   * This is needed because the Tabs component doesn't re-render when the screen size changes.
   */
  Dimensions.addEventListener("change", () => {});

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: tabIconDefaultColor,
        headerStyle: { backgroundColor },
        headerShown: true,
        tabBarStyle: {
          backgroundColor,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Welcome",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={28} color={color} />
          ),
          headerRight: () => (
            <Link href="/(tabs)" asChild>
              <HapticTab style={styles.tabBarButton}>
                {({ pressed }) => (
                  <ThemedView style={styles.icon}>
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      color={iconColor}
                      style={[
                        styles.tabBarIcon,
                        { opacity: pressed ? 0.5 : 1 },
                      ]}
                    />
                  </ThemedView>
                )}
              </HapticTab>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="compass" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarButton: {
    marginRight: 15,
  },
  tabBarIcon: {
    marginBottom: -3,
  },
  icon: {
    padding: 5,
  },
});
