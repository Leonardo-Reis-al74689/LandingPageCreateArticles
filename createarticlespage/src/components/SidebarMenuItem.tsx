"use client"

import { LucideIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem as ShadcnSidebarMenuItem } from "@/components/ui/sidebar";

interface SidebarMenuItemProps {
  title: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

export function SidebarMenuItem({ title, icon: Icon, isActive, onClick }: SidebarMenuItemProps) {
  return (
    <ShadcnSidebarMenuItem>
      <SidebarMenuButton 
        onClick={onClick}
        className={`cursor-pointer transition-all duration-200 ${
          isActive 
            ? 'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border-r-2 border-red-600' 
            : 'hover:bg-gray-100 hover:text-gray-700'
        }`}
      >
        <Icon 
          className={`transition-all duration-200 ${
            isActive ? 'text-red-600 scale-110' : ''
          }`}
          size={isActive ? 20 : 16}
        />
        <span className={`transition-all duration-200 ${
          isActive 
            ? 'text-red-600 font-semibold text-base scale-105' 
            : 'text-sm'
        }`}>
          {title}
        </span>
      </SidebarMenuButton>
    </ShadcnSidebarMenuItem>
  );
}
