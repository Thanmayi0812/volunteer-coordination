"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Users,
  ClipboardList,
  Activity,
  Radio,
} from "lucide-react"

export function TrackingMap() {
  const { volunteers, tasks } = useStore()
  const [activeTab, setActiveTab] = useState("volunteers")

  const assignedVolunteers = volunteers.filter((v) => v.status === "assigned")
  const activeTasks = tasks.filter((t) => t.status === "in-progress")

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Radio className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Now</p>
                <p className="text-2xl font-bold">{assignedVolunteers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks In Progress</p>
                <p className="text-2xl font-bold">{activeTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Activity className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Real-Time Tracking
          </CardTitle>
          <CardDescription>
            Monitor volunteer locations and task progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map Area */}
            <div className="lg:col-span-2">
              <div className="relative h-[400px] rounded-xl bg-gradient-to-br from-muted/50 to-muted overflow-hidden border">
                {/* Simulated Map Grid */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border border-border/20" />
                  ))}
                </div>
                
                {/* Map Labels */}
                <div className="absolute top-4 left-4 text-xs font-medium text-muted-foreground/60">
                  Downtown Area
                </div>
                <div className="absolute top-4 right-4 text-xs font-medium text-muted-foreground/60">
                  East District
                </div>
                <div className="absolute bottom-4 left-4 text-xs font-medium text-muted-foreground/60">
                  South Quarter
                </div>
                <div className="absolute bottom-4 right-4 text-xs font-medium text-muted-foreground/60">
                  Harbor Zone
                </div>

                {/* Volunteer Markers */}
                {volunteers.slice(0, 8).map((volunteer, index) => {
                  const positions = [
                    { top: "20%", left: "30%" },
                    { top: "40%", left: "60%" },
                    { top: "60%", left: "25%" },
                    { top: "35%", left: "75%" },
                    { top: "70%", left: "55%" },
                    { top: "25%", left: "50%" },
                    { top: "55%", left: "40%" },
                    { top: "45%", left: "20%" },
                  ]
                  const pos = positions[index]

                  return (
                    <div
                      key={volunteer.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      style={{ top: pos.top, left: pos.left }}
                    >
                      <div className="relative">
                        {volunteer.status === "assigned" && (
                          <div className="absolute inset-0 animate-ping">
                            <div className="h-10 w-10 rounded-full bg-primary/30" />
                          </div>
                        )}
                        <Avatar className={`h-10 w-10 border-3 shadow-lg ${
                          volunteer.status === "assigned" 
                            ? "border-primary" 
                            : "border-emerald-500"
                        }`}>
                          <AvatarImage src={volunteer.avatar} alt={volunteer.name} />
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {volunteer.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                          volunteer.status === "assigned"
                            ? "bg-blue-500"
                            : volunteer.status === "available"
                            ? "bg-emerald-500"
                            : "bg-gray-400"
                        }`} />
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg border whitespace-nowrap">
                          <p className="font-medium text-sm">{volunteer.name}</p>
                          <p className="text-xs text-muted-foreground">{volunteer.location}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Task Location Markers */}
                {tasks.slice(0, 4).map((task, index) => {
                  const positions = [
                    { top: "30%", left: "45%" },
                    { top: "50%", left: "70%" },
                    { top: "65%", left: "35%" },
                    { top: "40%", left: "15%" },
                  ]
                  const pos = positions[index]

                  return (
                    <div
                      key={task.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      style={{ top: pos.top, left: pos.left }}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shadow-lg ${
                        task.status === "in-progress"
                          ? "bg-blue-500 text-white"
                          : task.status === "completed"
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}>
                        <ClipboardList className="h-4 w-4" />
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg border whitespace-nowrap">
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{task.location}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Legend */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full border shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span>Assigned</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="h-3 w-3 rounded-lg bg-amber-500" />
                    <span>Task</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Panel */}
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="volunteers" className="flex-1">
                    <Users className="h-4 w-4 mr-1.5" />
                    Active
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="flex-1">
                    <ClipboardList className="h-4 w-4 mr-1.5" />
                    Tasks
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="volunteers" className="mt-4 space-y-3">
                  {assignedVolunteers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No active volunteers
                    </p>
                  ) : (
                    assignedVolunteers.map((volunteer) => (
                      <div
                        key={volunteer.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={volunteer.avatar} alt={volunteer.name} />
                          <AvatarFallback className="text-xs">
                            {volunteer.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{volunteer.name}</p>
                          <p className="text-xs text-muted-foreground">{volunteer.location}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          On Task
                        </Badge>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="tasks" className="mt-4 space-y-3">
                  {activeTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No active tasks
                    </p>
                  ) : (
                    activeTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg bg-muted/50 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium">{task.title}</p>
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                          >
                            In Progress
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {task.location}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {task.assignedVolunteers}/{task.volunteersNeeded} volunteers
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
