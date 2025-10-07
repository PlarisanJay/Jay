
import { useLocalSearchParams, useRouter } from "expo-router"
import { useContext, useState, useEffect } from "react"
import { SafeAreaView, TextInput, Pressable, Text, StyleSheet } from "react-native"
import { GoalsContext } from "../../../contexts/GoalsContext"

export default function EditGoal() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { goals, updateGoal } = useContext(GoalsContext)

  const goal = goals.find((g) => g.id === id)
  const [title, setTitle] = useState(goal?.title || "")
  const [description, setDescription] = useState(goal?.description || "")

  useEffect(() => {
    if (!goal) {
      router.back()
    }
  }, [])

  const handleSave = async () => {
    await updateGoal(id, { title, description })
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Edit Title"
      />
      <TextInput
        style={[styles.input1, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Edit Description"
        multiline
      />
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { 
    
    marginTop: 20,
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff" 
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1ceceb4",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  input1: {
    borderWidth: 1,
    borderColor: "#d1ceceb4",
    borderRadius: 6,
    paddingVertical: "50%",
    marginBottom: 12,
    fontSize: 16,
  },
  saveButton: {
    marginTop: "10%",
    backgroundColor: "#0f67ccd7",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  saveText: {
     color: "white", 
     fontWeight: "bold", 
     fontSize: 16 
    },
})

