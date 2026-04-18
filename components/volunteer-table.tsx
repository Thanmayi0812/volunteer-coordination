"use client"

import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Clock, Sparkles } from "lucide-react"

export function VolunteerTable() {
  const { volunteers, setSelectedVolunteer, setActiveView } = useStore()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "assigned":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "unavailable":
        return "bg-gray-100 text-gray-600 border-gray-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const handleAssign = (volunteerId: string) => {
    setSelectedVolunteer(volunteerId)
    setActiveView("matching")
  }

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[280px]">Volunteer</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {volunteers.map((volunteer) => (
            <TableRow key={volunteer.id} className="group">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-muted">
                    <AvatarImage src={volunteer.avatar} alt={volunteer.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {volunteer.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{volunteer.name}</p>
                    <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {volunteer.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs font-normal">
                      {skill}
                    </Badge>
                  ))}
                  {volunteer.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs font-normal">
                      +{volunteer.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-sm">{volunteer.location}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-sm">{volunteer.availability}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(volunteer.status)}>
                  {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleAssign(volunteer.id)}
                  disabled={volunteer.status === "unavailable"}
                >
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  AI Match
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
