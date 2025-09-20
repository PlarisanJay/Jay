import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { auth, db, storage } from "../../firebaseConfig";
import { doc, updateDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Helper to convert local URI to blob for Firebase Storage
const blobFromUri = (uri) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new TypeError("Network request failed"));
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const refUser = doc(db, "users", user.uid);

    const unsubscribeUser = onSnapshot(
      refUser,
      (snap) => {
        if (snap.exists()) {
          setUserData((prev) => ({ ...(prev || {}), ...snap.data() }));
        }
      },
      (err) => console.error("Error fetching user profile:", err)
    );

    const goalsQuery = query(collection(db, "goals"), where("userId", "==", user.uid));
    const unsubscribeGoals = onSnapshot(goalsQuery, (snapshot) => {
      setUserData((prev) => ({ ...(prev || {}), goalCount: snapshot.size }));
    });

    setLoading(false);

    return () => {
      unsubscribeUser();
      unsubscribeGoals();
    };
  }, []);

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required", "Please allow access to your photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled) return;
      const user = auth.currentUser;
      if (!user) return;

      setUploading(true);
      setProgress(0);

      const uri = result.assets[0].uri;
      const blob = await blobFromUri(uri);

      const storageRef = ref(storage, `profiles/${user.uid}.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(percent);
        },
        (error) => {
          console.log("Upload error:", error);
          Alert.alert("Upload failed", "Could not upload image. Please try again.");
          setUploading(false);
          setProgress(0);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(storageRef);
            await updateDoc(doc(db, "users", user.uid), { photoURL: downloadURL });
            setUserData((prev) => ({ ...(prev || {}), photoURL: downloadURL }));
          } catch (err) {
            console.log("Error saving photo URL:", err);
            Alert.alert("Error", "Saved photo but failed to update profile info.");
          } finally {
            setUploading(false);
            setProgress(0);
          }
        }
      );
    } catch (err) {
      console.log("Unexpected error picking/uploading image:", err);
      Alert.alert("Error", "Could not pick/upload image.");
      setUploading(false);
      setProgress(0);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/auth/login");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1a4dac" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.imageContainer}>
          {userData?.photoURL ? (
            <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.defaultAvatar]}>
              <MaterialIcons name="person" size={80} color="#fff" />
            </View>
          )}

          <Pressable
            style={[styles.cameraButton, uploading && styles.cameraButtonDisabled]}
            onPress={handlePickImage}
            disabled={uploading}
          >
            <Ionicons name="camera" size={20} color="white" />
          </Pressable>

          {uploading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.progressText}>{progress}%</Text>
            </View>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.row}>
            Name: {userData?.firstName} {userData?.mi ? userData.mi + "." : ""} {userData?.lastName}
          </Text>
          <Text style={styles.row}>Username: {userData?.username}</Text>
          <Text style={styles.row}>Bio: {userData?.bio || "No bio yet"}</Text>
          <Text style={styles.row}>Desires created: {userData?.goalCount || 0}</Text>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#1a4dac",
  },
  profileCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#1a4dac",
    backgroundColor: "#c4c4c4",
  },
  defaultAvatar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a4dac",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#0f67cc",
    borderRadius: 20,
    padding: 8,
  },
  cameraButtonDisabled: {
    backgroundColor: "#7f9bbd",
  },
  overlay: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    color: "#fff",
    marginTop: 6,
    fontWeight: "bold",
  },
  infoBox: {
    width: "100%",
    marginTop: 10,
  },
  row: {
    fontSize: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    color: "#333",
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#1a4dac",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
