import { Image, StyleSheet, Platform, ScrollView } from "react-native";
import { Button } from "react-native-paper";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import OfflineIndicator from "@/components/ui/OfflineIndicator";
import SyncStatusIndicator from "@/components/ui/SyncStatusIndicator";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useAuth } from "@/app/context/index";

export default function HomeScreen() {
  const { isOffline } = useNetworkStatus();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled by the auth context automatically
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <OfflineIndicator />
      <ScrollView>
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          {isOffline && (
            <ThemedText style={styles.offlineText}>
              (Working Offline)
            </ThemedText>
          )}
        </ThemedView>
        
        {user && (
          <ThemedView style={styles.userInfo}>
            <ThemedText>
              Logged in as: {user.displayName || user.email}
            </ThemedText>
          </ThemedView>
        )}
        
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 1: Try it</ThemedText>
          <ThemedText>
            Edit{" "}
            <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
            to see changes. Press{" "}
            <ThemedText type="defaultSemiBold">
              {Platform.select({
                ios: "cmd + d",
                android: "cmd + m",
                web: "F12",
              })}
            </ThemedText>{" "}
            to open developer tools.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          <ThemedText>
            Tap the Explore tab to learn more about what's included in this
            starter app.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 3: Start building</ThemedText>
          <ThemedText>
            The codebase has been cleaned up and is ready for development. You can
            start by adding new tabs, screens, and components as needed. Firebase
            configuration is already set up in{" "}
            <ThemedText type="defaultSemiBold">app/firebase.ts</ThemedText>.
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.logoutContainer}>
          <Button 
            mode="contained" 
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </Button>
        </ThemedView>
      </ScrollView>
      <SyncStatusIndicator />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 120,
    paddingHorizontal: 16,
  },
  userInfo: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    position: "absolute",
    top: 0,
    left: 0,
  },
  offlineText: {
    color: "#ff4d4f",
    fontStyle: "italic",
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
  },
  logoutButton: {
    width: "80%",
    paddingVertical: 6,
  },
});
