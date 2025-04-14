import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
// Import Firebase app
import "@/app/firebase";

import { useColorScheme } from "@/hooks/useColorScheme";
import { NetworkProvider, AuthProvider, useAuth } from "@/app/context/index";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// This component handles auth state and redirects
function RootLayoutNav() {
  const { user, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    // Check if the user is authenticated and if they're trying to access a protected route
    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // If not authenticated and trying to access a protected route, redirect to sign in
      router.replace('/auth');
    } else if (user && inAuthGroup) {
      // If authenticated and trying to access auth screens, redirect to home
      router.replace('/');
    }
  }, [user, initialized, segments]);

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <NetworkProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </ThemeProvider>
      </NetworkProvider>
    </AuthProvider>
  );
}
