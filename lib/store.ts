"use client"

import { create } from "zustand"
import { collection, doc, setDoc, updateDoc, onSnapshot } from "firebase/firestore"
import { db } from "./firebase"

export interface Volunteer {
  id: string
  name: string
  email: string
  phone: string
  location: string
  availability: string
  skills: string[]
  status: "available" | "assigned" | "unavailable"
  avatar: string
  joinedDate: string
  completedTasks: number
  rating: number
  bio: string
  coordinates: { lat: number; lng: number }
}

export interface Task {
  id: string
  title: string
  description: string
  location: string
  date: string
  time: string
  requiredSkills: string[]
  volunteersNeeded: number
  assignedVolunteers: number
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high" | "urgent"
}

type View = "dashboard" | "volunteers" | "tasks" | "register" | "matching" | "tracking"

interface AppState {
  volunteers: Volunteer[]
  tasks: Task[]
  activeView: View
  selectedTask: string | null
  selectedVolunteer: string | null
  addVolunteer: (volunteer: Volunteer) => Promise<void>
  updateVolunteer: (id: string, updates: Partial<Volunteer>) => Promise<void>
  addTask: (task: Task) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  assignVolunteerToTask: (volunteerId: string, taskId: string) => Promise<void>
  setActiveView: (view: View) => void
  setSelectedTask: (taskId: string | null) => void
  setSelectedVolunteer: (volunteerId: string | null) => void
  initializeFirebase: () => () => void
}

export const useStore = create<AppState>((set, get) => ({
  volunteers: [],
  tasks: [],
  activeView: "dashboard",
  selectedTask: null,
  selectedVolunteer: null,

  addVolunteer: async (volunteer) => {
    // Optimistic update
    set((state) => ({ volunteers: [...state.volunteers, volunteer] }))
    try {
      await setDoc(doc(db, "volunteers", volunteer.id), volunteer)
    } catch (error) {
      console.error("Error adding volunteer to Firebase:", error)
    }
  },

  updateVolunteer: async (id, updates) => {
    // Optimistic update
    set((state) => ({
      volunteers: state.volunteers.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      ),
    }))
    try {
      await updateDoc(doc(db, "volunteers", id), updates)
    } catch (error) {
      console.error("Error updating volunteer in Firebase:", error)
    }
  },

  addTask: async (task) => {
    // Optimistic update
    set((state) => ({ tasks: [...state.tasks, task] }))
    try {
      await setDoc(doc(db, "tasks", task.id), task)
    } catch (error) {
      console.error("Error adding task to Firebase:", error)
    }
  },

  updateTask: async (id, updates) => {
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }))
    try {
      await updateDoc(doc(db, "tasks", id), updates)
    } catch (error) {
      console.error("Error updating task in Firebase:", error)
    }
  },

  assignVolunteerToTask: async (volunteerId, taskId) => {
    const state = get()
    const task = state.tasks.find((t) => t.id === taskId)
    const volunteer = state.volunteers.find((v) => v.id === volunteerId)
    
    if (!task || !volunteer) return

    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, assignedVolunteers: t.assignedVolunteers + 1 } : t
      ),
      volunteers: state.volunteers.map((v) =>
        v.id === volunteerId ? { ...v, status: "assigned" } : v
      ),
    }))

    try {
      await updateDoc(doc(db, "tasks", taskId), { assignedVolunteers: task.assignedVolunteers + 1 })
      await updateDoc(doc(db, "volunteers", volunteerId), { status: "assigned" })
    } catch (error) {
      console.error("Error assigning volunteer in Firebase:", error)
    }
  },

  setActiveView: (view) => set({ activeView: view }),
  setSelectedTask: (taskId) => set({ selectedTask: taskId }),
  setSelectedVolunteer: (volunteerId) => set({ selectedVolunteer: volunteerId }),

  initializeFirebase: () => {
    const unsubVolunteers = onSnapshot(collection(db, "volunteers"), (snapshot) => {
      const volunteersData = snapshot.docs.map((doc) => doc.data() as Volunteer)
      set({ volunteers: volunteersData })
    }, (error) => {
      console.error("Error listening to volunteers collection:", error)
    })

    const unsubTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => doc.data() as Task)
      set({ tasks: tasksData })
    }, (error) => {
      console.error("Error listening to tasks collection:", error)
    })

    // Return an unsubscribe function to cleanup listeners on unmount
    return () => {
      unsubVolunteers()
      unsubTasks()
    }
  }
}))
