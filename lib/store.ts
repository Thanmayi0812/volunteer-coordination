"use client"

import { create } from "zustand"

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
  addVolunteer: (volunteer: Volunteer) => void
  updateVolunteer: (id: string, updates: Partial<Volunteer>) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  assignVolunteerToTask: (volunteerId: string, taskId: string) => void
  setActiveView: (view: View) => void
  setSelectedTask: (taskId: string | null) => void
  setSelectedVolunteer: (volunteerId: string | null) => void
}

const initialVolunteers: Volunteer[] = [
  {
    id: "vol-1",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    location: "Downtown",
    availability: "Weekends",
    skills: ["First Aid", "Teaching", "Translation"],
    status: "available",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    joinedDate: "2024-01-15",
    completedTasks: 23,
    rating: 4.9,
    bio: "Passionate about community service",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: "vol-2",
    name: "Marcus Johnson",
    email: "marcus.j@email.com",
    phone: "+1 (555) 234-5678",
    location: "Midtown",
    availability: "Flexible",
    skills: ["Driving", "Logistics", "Event Planning"],
    status: "assigned",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    joinedDate: "2023-08-22",
    completedTasks: 45,
    rating: 4.7,
    bio: "Retired logistics manager",
    coordinates: { lat: 40.7549, lng: -73.984 },
  },
  {
    id: "vol-3",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "+1 (555) 345-6789",
    location: "Upper East",
    availability: "Evenings",
    skills: ["Cooking", "Event Planning", "Social Media"],
    status: "available",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    joinedDate: "2024-03-10",
    completedTasks: 12,
    rating: 5.0,
    bio: "Chef and food blogger",
    coordinates: { lat: 40.7736, lng: -73.9566 },
  },
  {
    id: "vol-4",
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 456-7890",
    location: "Brooklyn",
    availability: "Weekdays",
    skills: ["Technical Support", "Photography", "Teaching"],
    status: "available",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    joinedDate: "2023-11-05",
    completedTasks: 31,
    rating: 4.8,
    bio: "Software engineer who loves teaching",
    coordinates: { lat: 40.6782, lng: -73.9442 },
  },
  {
    id: "vol-5",
    name: "Priya Patel",
    email: "priya.p@email.com",
    phone: "+1 (555) 567-8901",
    location: "Queens",
    availability: "Mornings",
    skills: ["Translation", "Teaching", "Social Media"],
    status: "unavailable",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    joinedDate: "2024-02-28",
    completedTasks: 18,
    rating: 4.6,
    bio: "Multilingual educator",
    coordinates: { lat: 40.7282, lng: -73.7949 },
  },
  {
    id: "vol-6",
    name: "James Wilson",
    email: "james.w@email.com",
    phone: "+1 (555) 678-9012",
    location: "Harlem",
    availability: "Flexible",
    skills: ["First Aid", "Driving", "Logistics"],
    status: "available",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    joinedDate: "2022-06-12",
    completedTasks: 67,
    rating: 4.9,
    bio: "Former EMT, always ready to help",
    coordinates: { lat: 40.8116, lng: -73.9465 },
  },
  {
    id: "vol-7",
    name: "Aisha Mohammed",
    email: "aisha.m@email.com",
    phone: "+1 (555) 789-0123",
    location: "Bronx",
    availability: "Weekends",
    skills: ["Cooking", "Translation", "Event Planning"],
    status: "available",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
    joinedDate: "2023-09-18",
    completedTasks: 29,
    rating: 4.8,
    bio: "Community organizer and chef",
    coordinates: { lat: 40.8448, lng: -73.8648 },
  },
  {
    id: "vol-8",
    name: "Michael Chang",
    email: "michael.c@email.com",
    phone: "+1 (555) 890-1234",
    location: "Staten Island",
    availability: "Evenings",
    skills: ["Photography", "Social Media", "Technical Support"],
    status: "assigned",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    joinedDate: "2024-04-02",
    completedTasks: 14,
    rating: 4.5,
    bio: "Professional photographer",
    coordinates: { lat: 40.5795, lng: -74.1502 },
  },
]

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Community Food Drive",
    description: "Help distribute food packages to families in need at the community center.",
    location: "Community Center, Downtown",
    date: "Sat, Dec 21",
    time: "9:00 AM - 2:00 PM",
    requiredSkills: ["Logistics", "Driving"],
    volunteersNeeded: 8,
    assignedVolunteers: 5,
    status: "in-progress",
    priority: "high",
  },
  {
    id: "task-2",
    title: "Senior Tech Workshop",
    description: "Teach basic smartphone and computer skills to senior citizens.",
    location: "Senior Center, Midtown",
    date: "Sun, Dec 22",
    time: "2:00 PM - 5:00 PM",
    requiredSkills: ["Technical Support", "Teaching"],
    volunteersNeeded: 4,
    assignedVolunteers: 2,
    status: "pending",
    priority: "medium",
  },
  {
    id: "task-3",
    title: "Emergency First Aid Station",
    description: "Staff the first aid station at the annual marathon event.",
    location: "Central Park",
    date: "Sat, Dec 28",
    time: "6:00 AM - 12:00 PM",
    requiredSkills: ["First Aid"],
    volunteersNeeded: 6,
    assignedVolunteers: 0,
    status: "pending",
    priority: "urgent",
  },
  {
    id: "task-4",
    title: "Holiday Meal Preparation",
    description: "Prepare and serve holiday meals for shelter residents.",
    location: "Hope Shelter, Brooklyn",
    date: "Tue, Dec 24",
    time: "8:00 AM - 3:00 PM",
    requiredSkills: ["Cooking", "Event Planning"],
    volunteersNeeded: 10,
    assignedVolunteers: 4,
    status: "in-progress",
    priority: "high",
  },
  {
    id: "task-5",
    title: "Refugee Welcome Event",
    description: "Help welcome new refugee families with translation and orientation.",
    location: "Welcome Center, Queens",
    date: "Mon, Dec 23",
    time: "10:00 AM - 4:00 PM",
    requiredSkills: ["Translation", "Teaching"],
    volunteersNeeded: 5,
    assignedVolunteers: 3,
    status: "pending",
    priority: "medium",
  },
  {
    id: "task-6",
    title: "Youth Photography Class",
    description: "Teach photography basics to underprivileged youth.",
    location: "Community Arts Center",
    date: "Sat, Dec 28",
    time: "1:00 PM - 4:00 PM",
    requiredSkills: ["Photography", "Teaching"],
    volunteersNeeded: 3,
    assignedVolunteers: 1,
    status: "pending",
    priority: "low",
  },
]

export const useStore = create<AppState>((set) => ({
  volunteers: initialVolunteers,
  tasks: initialTasks,
  activeView: "dashboard",
  selectedTask: null,
  selectedVolunteer: null,

  addVolunteer: (volunteer) =>
    set((state) => ({
      volunteers: [...state.volunteers, volunteer],
    })),

  updateVolunteer: (id, updates) =>
    set((state) => ({
      volunteers: state.volunteers.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      ),
    })),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),

  assignVolunteerToTask: (volunteerId, taskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, assignedVolunteers: t.assignedVolunteers + 1 }
          : t
      ),
      volunteers: state.volunteers.map((v) =>
        v.id === volunteerId ? { ...v, status: "assigned" } : v
      ),
    })),

  setActiveView: (view) => set({ activeView: view }),
  setSelectedTask: (taskId) => set({ selectedTask: taskId }),
  setSelectedVolunteer: (volunteerId) => set({ selectedVolunteer: volunteerId }),
}))
