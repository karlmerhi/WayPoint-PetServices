import { Link, Tabs } from "expo-router";
import { Dimensions, StyleSheet, Alert } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/app/context/index";

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
  const { logout } = useAuth();

  /**
   * Hack to re-render the Tabs component when the screen size changes.
   * This is needed because the Tabs component doesn't re-render when the screen size changes.
   */
  Dimensions.addEventListener("change", () => {});

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await logout();
              // Navigation will be handled by auth context
            } catch (error) {
              console.error("Error logging out:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

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
            <ThemedView style={styles.headerButtons}>
              <HapticTab style={styles.tabBarButton} onPress={handleLogout}>
                {({ pressed }) => (
                  <ThemedView style={styles.icon}>
                    <FontAwesome
                      name="sign-out"
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
            </ThemedView>
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
      <Tabs.Screen
        name="offline-test"
        options={{
          title: "Offline Test",
          tabBarLabel: "Test",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="cloud" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: "row",
    marginRight: 15,
  },
  tabBarButton: {
    marginHorizontal: 5,
  },
  tabBarIcon: {
    marginBottom: -3,
  },
  icon: {
    padding: 5,
  },
});
