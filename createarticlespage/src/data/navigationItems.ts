import { LayoutList, LayoutDashboard, ChartColumn, Settings, Users, Compass, Truck } from "lucide-react";
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
    icon: LayoutDashboard,
    category: 'main'
  },
  {
    id: "backlog",
    title: "Backlog",
    icon: LayoutList,
    category: 'main'
  },
  {
    id: "roadmap",
    title: "Roadmap",
    icon: Compass ,
    category: 'main'
  },
  {
    id: "reports",
    title: "Reports",
    icon: ChartColumn,
    category: 'main'
  },
  {
    id: "releases",
    title: "Releases",
    icon: Truck,
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
