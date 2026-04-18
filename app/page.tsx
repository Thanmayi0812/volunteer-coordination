"use client"

import { useStore } from "@/lib/store"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardView } from "@/components/dashboard-view"
import { VolunteerTable } from "@/components/volunteer-table"
import { TaskList } from "@/components/task-list"
import { RegistrationForm } from "@/components/registration-form"
import { AIMatching } from "@/components/ai-matching"
import { TrackingMap } from "@/components/tracking-map"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

const viewTitles: Record<string, { title: string; description: string }> = {
  dashboard: { title: "Dashboard", description: "Overview of volunteer operations" },
  volunteers: { title: "Volunteers", description: "Manage registered volunteers" },
  tasks: { title: "Tasks", description: "View and manage volunteer tasks" },
  register: { title: "Register", description: "Add a new volunteer" },
  matching: { title: "AI Matching", description: "Smart volunteer assignment" },
  tracking: { title: "Live Tracking", description: "Real-time monitoring" },
}

export default function Home() {
  const { activeView } = useStore()
  const currentView = viewTitles[activeView] || viewTitles.dashboard

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />
      case "volunteers":
        return <VolunteerTable />
      case "tasks":
        return <TaskList />
      case "register":
        return <RegistrationForm />
      case "matching":
        return <AIMatching />
      case "tracking":
        return <TrackingMap />
      default:
        return <DashboardView />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">
                  {currentView.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <span className="text-sm text-muted-foreground ml-2 hidden sm:inline">
            {currentView.description}
          </span>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {renderView()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
