import { Inbox, Search, Settings } from "lucide-react"
import { 
    LuLayoutDashboard,
    LuCompass 
} from "react-icons/lu";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Separator } from "@/components/ui/separator"

// Menu items.
const items = [
  {
    title: "Create Articles",
    url: "#",
    icon: LuLayoutDashboard,
  },
  {
    title: "Backlog",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Roadmap",
    url: "#",
    icon: LuCompass,
  },
  {
    title: "Reports",
    url: "#",
    icon: Search,
  },
  {
    title: "Releases",
    url: "#",
    icon: Settings,
  },
  {
    title: "Teams",
    url: "#",
    icon: Search,
  },
  {
    title: "Project Settings",
    url: "#",
    icon: Settings,
  },
]

const drawSeparator = 5;
const finishElementsTable = 7;

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel style={{ justifyContent: 'flex-start', position: 'relative', zIndex: 2, background: 'transparent', minHeight: 100, paddingLeft: 8 }}>
            <img 
              src="/WIP_ Logo 1-1.jpg" 
              alt="WIP Logo" 
              style={{ height: 100, width: 100, objectFit: 'contain', display: 'block', marginLeft: 0, zIndex: 2, background: 'transparent', position: 'relative' }} 
            />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.slice(0, drawSeparator).map((item, idx) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Separator className="my-2" />
              {items.slice(drawSeparator, finishElementsTable).map((item, idx) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}