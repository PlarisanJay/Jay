import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { GoalsProvider } from '../../contexts/GoalsContext'
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebaseConfig"
import { useRouter } from "expo-router"
import { View, ActivityIndicator } from "react-native"

export default function GoalsLayout() {
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login")
      }
      setChecking(false)
    })
    return unsub
  }, [])

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <GoalsProvider>
      <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'black', tabBarInactiveTintColor: 'grey' }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <Ionicons size={24} name={focused ? 'home' : 'home-outline'} color="black" />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Add new',
            tabBarIcon: ({ focused }) => (
              <Ionicons size={24} name={focused ? 'create' : 'create-outline'} color="black" />
            ),
          }}
        />
        
        <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  size={24}
                  name={focused ? "person" : "person-outline"}
                  color="black"
                />
              ),
            }}
          />

        <Tabs.Screen
          name="edit/[id]"
          options={{
            href: null, 
        }}
      />
      </Tabs>
    </GoalsProvider>
  )
}
