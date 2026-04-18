"use client"

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Sparkles,
  MapPin,
  UserPlus,
  Settings,
  HelpCircle,
  Heart,
} from "lucide-react"
import { useStore } from "@/lib/store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigation = [
  { name: "Dashboard", view: "dashboard" as const, icon: LayoutDashboard },
  { name: "Volunteers", view: "volunteers" as const, icon: Users },
  { name: "Tasks", view: "tasks" as const, icon: ClipboardList },
  { name: "AI Matching", view: "matching" as const, icon: Sparkles },
  { name: "Live Tracking", view: "tracking" as const, icon: MapPin },
  { name: "Register", view: "register" as const, icon: UserPlus },
]

export function AppSidebar() {
  const { activeView, setActiveView } = useStore()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-sidebar-foreground">VolunteerHub</h1>
            <p className="text-xs text-sidebar-foreground/60">Smart Coordination</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = activeView === item.view
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setActiveView(item.view)}
                      className="cursor-pointer"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="rounded-lg bg-primary/10 p-4 mx-2 mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-xs font-medium text-primary">AI-Powered</p>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Smart matching assigns volunteers based on skills, availability, and location.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
