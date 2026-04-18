"use client"

import { useStore } from "@/lib/store"
import { StatsCards } from "@/components/stats-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Users,
  CalendarDays,
} from "lucide-react"

export function DashboardView() {
  const { volunteers, tasks, setActiveView } = useStore()

  const topVolunteers = [...volunteers]
    .sort((a, b) => b.completedTasks - a.completedTasks)
    .slice(0, 5)

  const urgentTasks = tasks
    .filter((t) => t.priority === "urgent" && t.status !== "completed")
    .slice(0, 3)

  const upcomingTasks = tasks
    .filter((t) => t.status === "pending")
    .slice(0, 4)

  const recentActivity = [
    { type: "assignment", message: "Sarah Chen assigned to Food Distribution", time: "2 min ago" },
    { type: "completion", message: "Park Cleanup completed successfully", time: "15 min ago" },
    { type: "registration", message: "New volunteer Michael Brown joined", time: "1 hour ago" },
    { type: "assignment", message: "David Kim assigned to Senior Support", time: "2 hours ago" },
  ]

  return (
    <div className="space-y-6">
      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Urgent Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Urgent Tasks
              </CardTitle>
              <CardDescription>Tasks requiring immediate attention</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveView("tasks")}>
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {urgentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-3" />
                <p className="text-muted-foreground">No urgent tasks at the moment</p>
              </div>
            ) : (
              urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/10"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{task.title}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {task.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {task.time}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">Urgent</Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.volunteersNeeded - task.assignedVolunteers} needed
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Volunteers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Top Volunteers
              </CardTitle>
              <CardDescription>Most active this month</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {topVolunteers.map((volunteer, index) => (
              <div
                key={volunteer.id}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={volunteer.avatar} alt={volunteer.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {volunteer.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  {index < 3 && (
                    <div className={`absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? "bg-amber-500" : index === 1 ? "bg-gray-400" : "bg-amber-700"
                    }`}>
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{volunteer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {volunteer.completedTasks} tasks completed
                  </p>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="text-sm font-medium">{volunteer.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>Tasks scheduled for this week</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveView("tasks")}>
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => {
                const progress = (task.assignedVolunteers / task.volunteersNeeded) * 100
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <CalendarDays className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{task.title}</p>
                        <Badge
                          variant="outline"
                          className={
                            task.priority === "high"
                              ? "bg-orange-100 text-orange-700 border-orange-200"
                              : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : "bg-green-100 text-green-700 border-green-200"
                          }
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {task.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {task.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={progress} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          <Users className="h-3 w-3 inline mr-1" />
                          {task.assignedVolunteers}/{task.volunteersNeeded}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from the team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${
                    activity.type === "assignment"
                      ? "bg-blue-500"
                      : activity.type === "completion"
                      ? "bg-emerald-500"
                      : "bg-primary"
                  }`} />
                  <div className="space-y-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
