"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"

import { Separator } from "@/components/ui/separator"
import { useNavigation } from "@/contexts/NavigationContext"
import { SidebarMenuItem } from "@/components/SidebarMenuItem"
import { navigationItems, getItemsByCategory } from "@/data/navigationItems"

export function AppSidebar() {
  const { activeItem, setActiveItem } = useNavigation();
  
  const mainItems = getItemsByCategory('main');
  const secondaryItems = getItemsByCategory('secondary');

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-start items-center min-h-[100px] pl-2">
            <img 
              src="/WIP_ Logo 1-1.jpg" 
              alt="WIP Logo" 
              className="h-[100px] w-[100px] object-contain"
            />
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem
                  key={item.id}
                  title={item.title}
                  icon={item.icon}
                  isActive={activeItem === item.id}
                  onClick={() => handleItemClick(item.id)}
                />
              ))}
              
              <Separator className="my-2" />
              
              {secondaryItems.map((item) => (
                <SidebarMenuItem
                  key={item.id}
                  title={item.title}
                  icon={item.icon}
                  isActive={activeItem === item.id}
                  onClick={() => handleItemClick(item.id)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}