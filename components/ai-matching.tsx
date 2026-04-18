"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Sparkles,
  Brain,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  Users,
} from "lucide-react"

interface MatchResult {
  volunteerId: string
  score: number
  reasons: string[]
}

export function AIMatching() {
  const { 
    volunteers, 
    tasks, 
    selectedTask, 
    selectedVolunteer,
    assignVolunteerToTask,
    setActiveView 
  } = useStore()
  
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)

  const task = tasks.find((t) => t.id === selectedTask)
  const volunteer = volunteers.find((v) => v.id === selectedVolunteer)

  const analysisSteps = [
    { label: "Analyzing skills compatibility", icon: Brain },
    { label: "Checking location proximity", icon: MapPin },
    { label: "Evaluating availability", icon: Clock },
    { label: "Calculating match scores", icon: Target },
  ]

  useEffect(() => {
    if (!task && !volunteer) {
      setActiveView("dashboard")
      return
    }

    const runAnalysis = async () => {
      for (let i = 0; i < analysisSteps.length; i++) {
        setAnalysisStep(i)
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      // Generate AI matches
      const availableVolunteers = volunteers.filter((v) => v.status === "available")
      
      const scoredMatches = availableVolunteers.map((vol) => {
        let score = 0
        const reasons: string[] = []

        // Skill matching
        if (task) {
          const matchingSkills = vol.skills.filter((s) =>
            task.requiredSkills.includes(s)
          )
          const skillScore = (matchingSkills.length / task.requiredSkills.length) * 40
          score += skillScore
          if (matchingSkills.length > 0) {
            reasons.push(`${matchingSkills.length} matching skills`)
          }
        }

        // Rating bonus
        if (vol.rating >= 4.5) {
          score += 20
          reasons.push("High performer")
        } else if (vol.rating >= 4.0) {
          score += 10
          reasons.push("Reliable volunteer")
        }

        // Experience bonus
        if (vol.completedTasks >= 10) {
          score += 15
          reasons.push("Experienced volunteer")
        } else if (vol.completedTasks >= 5) {
          score += 10
          reasons.push("Active contributor")
        }

        // Availability match
        if (task && vol.availability === "Flexible") {
          score += 15
          reasons.push("Flexible schedule")
        } else if (task && vol.availability === "Weekends" && task.date.includes("Sat")) {
          score += 15
          reasons.push("Weekend available")
        }

        // Location proximity (simulated)
        const locationScore = Math.random() * 10 + 5
        score += locationScore
        if (locationScore > 10) {
          reasons.push("Nearby location")
        }

        return {
          volunteerId: vol.id,
          score: Math.min(Math.round(score), 100),
          reasons,
        }
      })

      // Sort by score and take top 5
      const topMatches = scoredMatches
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)

      setMatches(topMatches)
      setIsAnalyzing(false)
    }

    runAnalysis()
  }, [task, volunteer, volunteers, setActiveView])

  const handleAssign = () => {
    if (selectedMatch && task) {
      assignVolunteerToTask(selectedMatch, task.id)
      setActiveView("tasks")
    }
  }

  if (isAnalyzing) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-2xl">AI Matching in Progress</CardTitle>
          <CardDescription>
            Our AI is analyzing volunteers to find the best matches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          {analysisSteps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === analysisStep
            const isComplete = index < analysisStep

            return (
              <div
                key={step.label}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/5 border border-primary/20"
                    : isComplete
                    ? "bg-muted/50"
                    : "opacity-50"
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    isComplete
                      ? "bg-primary text-primary-foreground"
                      : isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className={`h-5 w-5 ${isActive ? "animate-pulse" : ""}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isActive ? "text-primary" : ""}`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <Progress value={75} className="h-1.5 mt-2" />
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {task && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {task.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {task.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {task.volunteersNeeded - task.assignedVolunteers} needed
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>AI-Recommended Matches</CardTitle>
                <CardDescription>
                  Top volunteers ranked by compatibility score
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              {matches.length} matches found
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {matches.map((match, index) => {
            const vol = volunteers.find((v) => v.id === match.volunteerId)
            if (!vol) return null

            const isSelected = selectedMatch === match.volunteerId

            return (
              <div
                key={match.volunteerId}
                onClick={() => setSelectedMatch(match.volunteerId)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <div className="relative">
                  <Avatar className="h-14 w-14 border-2 border-background">
                    <AvatarImage src={vol.avatar} alt={vol.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {vol.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    #{index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{vol.name}</h4>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-sm font-medium">{vol.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {vol.location}
                    </span>
                    <span>{vol.completedTasks} tasks completed</span>
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {match.reasons.map((reason) => (
                      <Badge key={reason} variant="secondary" className="text-xs font-normal">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{match.score}%</div>
                  <p className="text-xs text-muted-foreground">match score</p>
                </div>
              </div>
            )
          })}

          <Separator className="my-6" />

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setActiveView("tasks")}
            >
              Back to Tasks
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedMatch}
              className="gap-2"
            >
              Assign Selected Volunteer
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
