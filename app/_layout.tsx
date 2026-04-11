import "react-native-reanimated";

import { Fonts } from "@/constants/theme";
import { AuthContext } from "@/contexts/auth";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Platform, Text, TextInput, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const defaultFontFamily =
  Platform.OS === "ios"
    ? Fonts?.ios?.sans ?? "System"
    : Platform.OS === "android"
    ? Fonts?.default?.sans ?? "sans-serif"
    : Fonts?.web?.sans ?? "system-ui";

if (Text.defaultProps == null) Text.defaultProps = {};
if (TextInput.defaultProps == null) TextInput.defaultProps = {};

Text.defaultProps.style = [
  { fontFamily: defaultFontFamily },
  Text.defaultProps.style,
];

TextInput.defaultProps.style = [
  { fontFamily: defaultFontFamily },
  TextInput.defaultProps.style,
];

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

function RootLayoutNav() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const userid = await AsyncStorage.getItem('userid');
      setIsLoggedIn(!!userid);
      setIsLoading(false);
      SplashScreen.hideAsync();
    };
    checkLogin();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A1F44' }}>
        <Text style={{ color: '#fff', fontSize: 24 }}>UFGymBook</Text>
        <Text style={{ color: '#fff', fontSize: 16, marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <AuthContext>
              <RootLayoutNav />
            </AuthContext>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}