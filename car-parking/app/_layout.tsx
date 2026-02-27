import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/context/AppContext";
import Colors from "@/constants/colors";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.navy,
        headerTitleStyle: { fontWeight: '600' as const },
      }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="parking-details"
        options={{
          title: 'Parking Details',
          headerTransparent: true,
          headerTintColor: Colors.white,
          headerTitle: '',
        }}
      />
      <Stack.Screen name="booking" options={{ title: 'Book Parking', presentation: 'modal' }} />
      <Stack.Screen name="payment" options={{ title: 'Secure Payment', presentation: 'modal' }} />
      <Stack.Screen name="emergency" options={{ title: 'Emergency Help', presentation: 'modal' }} />
      <Stack.Screen name="owner-dashboard" options={{ title: 'Owner Dashboard' }} />
      <Stack.Screen name="map" options={{ title: 'Nearby Parking' }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <RootLayoutNav />
        </AppProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
