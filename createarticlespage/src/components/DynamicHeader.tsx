"use client"

import { useNavigation } from "@/contexts/NavigationContext"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { navigationItems } from "@/data/navigationItems"

export function DynamicHeader() {
  const { activeItem } = useNavigation();
  
  const currentItem = navigationItems.find(item => item.id === activeItem);
  const title = currentItem?.title || "Create Articles";

  return (
    <div className="flex items-center gap-2 p-4 border-b">
      <SidebarTrigger />
      <h2 className="font-semibold text-lg">{title}</h2>
    </div>
  );
}
