
import { useContext, useEffect, useState } from "react"
import { GoalsContext } from "../../contexts/GoalsContext"
import { auth } from "../../firebaseConfig"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
} from "react-native"
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu"
import { useRouter } from "expo-router"

export default function GoalsScreen() {
  const { goals, fetchGoals, deleteGoal } = useContext(GoalsContext)
  const [expandedId, setExpandedId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (auth.currentUser) {
      fetchGoals(auth.currentUser.uid)
    }
  }, [])

  const renderGoal = ({ item }) => (
    <Pressable
      style={styles.goalCard}
      onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        {expandedId === item.id && (
          <Text style={styles.description}>{item.description || "No description"}</Text>
        )}
      </View>

      <Menu>
        <MenuTrigger>
          <Text style={styles.menuTrigger}>⋮</Text>
        </MenuTrigger>
        <MenuOptions>
          <MenuOption
            onSelect={() => router.push(`/goals/edit/${item.id}`)}
            text="Edit"
          />
          <MenuOption onSelect={() => deleteGoal(item.id)} text="Delete" />
        </MenuOptions>
      </Menu>
    </Pressable>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Home</Text>

      {goals.length === 0 ? (
        <Text style={styles.empty}>You didn't write any yet. Add one!</Text>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={renderGoal}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#f9f9f9" 
  },
  heading: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
    marginTop: 8,
    marginLeft: 10
  },
  empty: { 
    fontSize: 16, 
    color: "gray", 
    textAlign: "center"
   },
  goalCard: {
    padding: 12,
    backgroundColor: "white",
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1ceceb4",
  },
  title: { 
    fontSize: 18, 
    fontWeight: "600" 
  },
  description: { 
    marginTop: 6, 
    fontSize: 14, 
    color: "gray" 
  },
  menuTrigger: { 
    fontSize: 20, 
    paddingHorizontal: 8 
  },
})

