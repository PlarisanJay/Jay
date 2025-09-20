import { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TextInput, Pressable, View } from "react-native";
import { GoalsContext } from "../../contexts/GoalsContext";
import { auth } from "../../firebaseConfig";

export default function CreateGoal() {
  const { createGoal } = useContext(GoalsContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) return alert("Please enter a title");
    await createGoal({
      title,
      description,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });
    setTitle("");
    setDescription("");
    alert("Desire created!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Write what you think</Text>

      <View style={styles.formRow}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
        />
      </View>

      <View style={styles.formRow}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="Put description what you think all about"
          multiline
        />
      </View>

      <Pressable style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Create</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: "#f5f7fa"
  },
  heading: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20,
    color: "#1a4dac"
  },
  formRow: { 
    marginBottom: 16 
  },
  label: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 6,
    color: "#333"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  descriptionInput: {
    paddingVertical: "50%", // Increased vertical padding for description
    textAlignVertical: "top", // ensures text starts at the top for multiline
  },
  button: {
    backgroundColor: "#0f67cc",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});
