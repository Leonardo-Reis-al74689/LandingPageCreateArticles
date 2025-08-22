import { Inbox, Search, Settings, Users, BarChart3, Rocket } from "lucide-react";
import { LuLayoutDashboard } from "react-icons/lu";
import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  id: string;
  title: string;
  icon: LucideIcon;
  category?: 'main' | 'secondary';
}

export const navigationItems: NavigationItem[] = [
  {
    id: "create-articles",
    title: "Create Articles",
    icon: LuLayoutDashboard as LucideIcon,
    category: 'main'
  },
  {
    id: "backlog",
    title: "Backlog",
    icon: Inbox,
    category: 'main'
  },
  {
    id: "roadmap",
    title: "Roadmap",
    icon: BarChart3,
    category: 'main'
  },
  {
    id: "reports",
    title: "Reports",
    icon: Search,
    category: 'main'
  },
  {
    id: "releases",
    title: "Releases",
    icon: Rocket,
    category: 'main'
  },
  {
    id: "teams",
    title: "Teams",
    icon: Users,
    category: 'secondary'
  },
  {
    id: "settings",
    title: "Project Settings",
    icon: Settings,
    category: 'secondary'
  }
];

export const getItemsByCategory = (category: 'main' | 'secondary') => 
  navigationItems.filter(item => item.category === category);
