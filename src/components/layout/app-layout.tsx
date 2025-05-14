"use client";
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import AppHeaderContent from './header-content';
import AppSidebarContent from './sidebar-content';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import Logo from './logo';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, UserCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="p-6 rounded-lg shadow-xl bg-card w-full max-w-sm text-center">
          <div className="flex justify-center mb-4">
             <svg className="w-12 h-12 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          </div>
          <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading your MediChat experience...</p>
        </div>
      </div>
    );
  }
  
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="p-3">
          <div className="flex items-center justify-between h-10">
            <Logo />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <AppSidebarContent userRole={user.role} />
        </SidebarContent>
        <SidebarFooter className="p-2 border-t border-sidebar-border">
           {/* Could add settings or profile link here */}
           {/* <Button variant="ghost" className="w-full justify-start mb-1" size="sm">
            <UserCircle className="mr-2 h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Profile</span>
          </Button>
           <Button variant="ghost" className="w-full justify-start mb-1" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Settings</span>
          </Button> */}
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout} size="sm" tooltip={{children: "Logout", side: "right", align: "center"}}>
            <LogOut className="mr-2 h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-card border-b shadow-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" /> {/* For mobile toggle */}
            <h1 className="text-lg font-semibold text-foreground">
              {/* Dynamic title can be set here using a context or Zustand store */}
              MediChat
            </h1>
          </div>
          <AppHeaderContent userName={user.name} userEmail={user.email} onLogout={logout} />
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default AppLayout;
