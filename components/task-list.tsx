"use client"

import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  MapPin, 
  Clock, 
  Users, 
  AlertCircle,
  CheckCircle2,
  Timer,
  Sparkles
} from "lucide-react"

export function TaskList() {
  const { tasks, setSelectedTask, setActiveView } = useStore()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      case "in-progress":
        return <Timer className="h-4 w-4 text-blue-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-amber-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const handleAIMatch = (taskId: string) => {
    setSelectedTask(taskId)
    setActiveView("matching")
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => {
        const progress = (task.assignedVolunteers / task.volunteersNeeded) * 100
        
        return (
          <Card key={task.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status)}
                  <CardTitle className="text-base font-semibold line-clamp-1">
                    {task.title}
                  </CardTitle>
                </div>
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{task.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{task.date} at {task.time}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {task.requiredSkills.slice(0, 2).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs font-normal">
                    {skill}
                  </Badge>
                ))}
                {task.requiredSkills.length > 2 && (
                  <Badge variant="outline" className="text-xs font-normal">
                    +{task.requiredSkills.length - 2}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>Volunteers</span>
                  </div>
                  <span className="font-medium">
                    {task.assignedVolunteers}/{task.volunteersNeeded}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <Button
                size="sm"
                className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleAIMatch(task.id)}
                disabled={task.status === "completed"}
              >
                <Sparkles className="h-4 w-4 mr-1.5" />
                Find Volunteers with AI
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
