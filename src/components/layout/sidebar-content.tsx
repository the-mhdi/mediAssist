"use client";

import type { UserRole } from '@/lib/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, MessageSquare, Users, UserPlus, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppSidebarContentProps {
  userRole: UserRole | null;
}

const AppSidebarContent = ({ userRole }: AppSidebarContentProps) => {
  const pathname = usePathname();

  const commonItems = []; // No common items for now beyond what's in footer.

  const patientNavItems = [
    { href: '/patient-dashboard', label: 'AI Chat', icon: MessageSquare, tooltip: 'AI Chat' },
  ];

  const doctorNavItems = [
    { href: '/doctor-dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
    { href: '/doctor-dashboard/generate-profile', label: 'New Patient', icon: UserPlus, tooltip: 'Generate Patient Profile' },
    // Example for a patient detail view, actual link would be dynamic. This is more of a placeholder.
    // { href: '/doctor-dashboard/view-patient', label: 'View Patients', icon: FileText, tooltip: 'View Patient Records' },
  ];

  const navItems = userRole === 'patient' ? patientNavItems : userRole === 'doctor' ? doctorNavItems : [];

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
              tooltip={{ children: item.tooltip, side: 'right', align: 'center' }}
              className={cn(
                (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))) && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <a>
                <item.icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default AppSidebarContent;
