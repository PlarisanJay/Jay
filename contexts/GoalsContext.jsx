

import { addDoc, collection, getDocs, query, where, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { createContext, useState } from "react"
import { db, auth } from "../firebaseConfig"

export const GoalsContext = createContext()

export function GoalsProvider({ children }) {
  const [goals, setGoals] = useState([])

  async function fetchGoals(userId) {
    if (!userId) return
    const q = query(collection(db, "goals"), where("userId", "==", userId))
    const snapshot = await getDocs(q)

    const fetched = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    setGoals(fetched)
  }

  async function createGoal(goalData) {
    if (!auth.currentUser) return
    await addDoc(collection(db, "goals"), {
      ...goalData,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    })
    await fetchGoals(auth.currentUser.uid)
  }

  // ✅ Delete one goal
  async function deleteGoal(id) {
    try {
      await deleteDoc(doc(db, "goals", id))
      setGoals(prev => prev.filter(goal => goal.id !== id))
    } catch (err) {
      console.error("Error deleting goal:", err)
    }
  }

  // ✅ Update one goal
  async function updateGoal(id, updatedData) {
    try {
      const goalRef = doc(db, "goals", id)
      await updateDoc(goalRef, updatedData)
      setGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updatedData } : g)))
    } catch (err) {
      console.error("Error updating goal:", err)
    }
  }

  return (
    <GoalsContext.Provider
      value={{ goals, fetchGoals, createGoal, deleteGoal, updateGoal }}
    >
      {children}
    </GoalsContext.Provider>
  )
}

