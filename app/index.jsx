import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Want</Text>
      <Text style={styles.title1}>Everything you think about, write it on Want</Text>

      <View style={styles.buttonRow}>
        {}
        <Pressable style={styles.squareButton} onPress={() => router.push("/goals")}>
          <Ionicons name="eye-outline" size={28} color="white" />
          <Text style={styles.buttonText}>View</Text>
        </Pressable>

        {}
        <Pressable style={styles.squareButton} onPress={() => router.push("/goals/create")}>
          <Ionicons name="add-circle-outline" size={28} color="white" />
          <Text style={styles.buttonText}>Add New</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e2e0e0ff"
  },
  title: {
    
    marginVertical: 40,
    fontSize: 36,
    fontWeight: "bold",
  },
  title1: {

    marginVertical: 20,
    fontSize: 16,
    marginTop: -20,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 30,
  },
  squareButton: {
    backgroundColor: "#0f67ccd7",
    width: 120,
    height: 120,
    marginHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default Home;
