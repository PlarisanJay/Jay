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
        <ActivityIndicator size="large" color="#1a4dac" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Want</Text>
      <Text style={styles.subtitle}>Everything you think about, write it on Want</Text>

      <View style={styles.buttonRow}>
        <Pressable style={styles.cardButton} onPress={() => router.push("/goals")}>
          <Ionicons name="eye-outline" size={32} color="white" />
          <Text style={styles.buttonText}>View</Text>
        </Pressable>

        <Pressable style={styles.cardButton} onPress={() => router.push("/goals/create")}>
          <Ionicons name="add-circle-outline" size={32} color="white" />
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
    backgroundColor: "#f5f7fa",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1a4dac",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  cardButton: {
    backgroundColor: "#0f67cc",
    width: 140,
    height: 140,
    marginHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Home;
