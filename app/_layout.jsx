import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { MenuProvider } from "react-native-popup-menu"

export default function RootLayout() {
  return (
    <MenuProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Home */}
        <Stack.Screen 
          name="index" 
          options={{ title: "Home" }} 
        />

        {/* Auth */}
        <Stack.Screen 
          name="auth/login" 
          options={{ title: "Login" }} 
        />
        <Stack.Screen 
          name="auth/signup" 
          options={{ title: "Sign Up" }} 
        />

        {/* Goals */}
        <Stack.Screen 
          name="goals" 
          options={{ headerShown: false }} 
        />

        {/* Fallback */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </MenuProvider>
  )
}
