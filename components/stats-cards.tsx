"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, ClipboardList, Clock, AlertTriangle } from "lucide-react"
import { useStore } from "@/lib/store"

export function StatsCards() {
  const { volunteers, tasks } = useStore()

  const availableVolunteers = volunteers.filter((v) => v.status === "available").length
  const activeTasks = tasks.filter((t) => t.status !== "completed").length
  const openTasks = tasks.filter((t) => t.status === "pending").length
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && t.status !== "completed").length
  const totalHours = volunteers.reduce((acc, v) => acc + v.completedTasks * 3, 0)

  const cards = [
    {
      title: "Total Volunteers",
      value: volunteers.length,
      subtext: `${availableVolunteers} available`,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Tasks",
      value: activeTasks,
      subtext: `${openTasks} open, ${inProgressTasks} in progress`,
      icon: ClipboardList,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Hours Volunteered",
      value: totalHours,
      subtext: "This month",
      icon: Clock,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Urgent Tasks",
      value: urgentTasks,
      subtext: "Need immediate attention",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {card.subtext}
                </p>
              </div>
              <div className={`rounded-full p-3 ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
