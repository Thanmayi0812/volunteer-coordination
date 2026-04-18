"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, X, UserPlus } from "lucide-react"
import { skillOptions } from "@/lib/data"

export function RegistrationForm() {
  const { addVolunteer, setActiveView } = useStore()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    availability: "",
    bio: "",
  })

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newVolunteer = {
      id: `vol-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      availability: formData.availability,
      skills: selectedSkills,
      status: "available" as const,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`,
      joinedDate: new Date().toISOString().split("T")[0],
      completedTasks: 0,
      rating: 5.0,
      bio: formData.bio,
      coordinates: { lat: 40.7128 + (Math.random() - 0.5) * 0.1, lng: -74.006 + (Math.random() - 0.5) * 0.1 },
    }
    
    addVolunteer(newVolunteer)
    setIsSubmitted(true)
    
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        availability: "",
        bio: "",
      })
      setSelectedSkills([])
      setActiveView("volunteers")
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-16 pb-16">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground">Registration Successful!</h3>
            <p className="text-muted-foreground max-w-sm">
              Thank you for registering as a volunteer. Our AI will now match you with tasks that fit your skills and availability.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Volunteer Registration</CardTitle>
            <CardDescription>
              Join our community and make a difference
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Select
              value={formData.availability}
              onValueChange={(value) => setFormData({ ...formData, availability: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Weekdays">Weekdays</SelectItem>
                <SelectItem value="Weekends">Weekends</SelectItem>
                <SelectItem value="Mornings">Mornings</SelectItem>
                <SelectItem value="Evenings">Evenings</SelectItem>
                <SelectItem value="Flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Skills (Select all that apply)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {skillOptions.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={skill}
                    checked={selectedSkills.includes(skill)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                  />
                  <label
                    htmlFor={skill}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {skill}
                  </label>
                </div>
              ))}
            </div>
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Tell us about yourself</Label>
            <Textarea
              id="bio"
              placeholder="Share your motivation for volunteering and any relevant experience..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            <UserPlus className="h-4 w-4 mr-2" />
            Register as Volunteer
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
