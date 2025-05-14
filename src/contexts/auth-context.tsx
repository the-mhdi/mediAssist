"use client";

import type { User, UserRole } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string, role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock a list of registered users for login simulation
const mockRegisteredUsers: User[] = [
  { id: 'doc1', email: 'doctor@medichat.com', name: 'Dr. Ada Lovelace', role: 'doctor' },
  { id: 'pat1', email: 'patient@medichat.com', name: 'Charles Babbage', role: 'patient' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const loadUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('currentUser');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  // Handle redirection based on auth state
   useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname === '/login' || pathname === '/signup';
      if (!user && !isAuthPage && pathname !== '/') {
         router.push('/login');
      } else if (user && isAuthPage) {
        // If user is logged in and on an auth page, redirect to their dashboard
        if (user.role === 'patient') {
          router.push('/patient-dashboard');
        } else if (user.role === 'doctor') {
          router.push('/doctor-dashboard');
        }
      }
    }
  }, [user, isLoading, pathname, router]);


  const login = (email: string, name: string, role: UserRole) => {
    // In a real app, you'd verify credentials against a backend.
    // For this mock, we'll "find" or "create" a user.
    let existingUser = mockRegisteredUsers.find(u => u.email === email && u.role === role);
    if (!existingUser && name) { // Simulate registration during login if name is provided
        existingUser = { id: Date.now().toString(), email, name, role };
        mockRegisteredUsers.push(existingUser); // Add to "database"
    } else if (!existingUser) { // Simple login attempt without prior registration details
        // Fallback for simple login test
        existingUser = { id: Date.now().toString(), email, name: email.split('@')[0], role };
    }


    setUser(existingUser);
    localStorage.setItem('currentUser', JSON.stringify(existingUser));
    if (existingUser.role === 'patient') {
      router.push('/patient-dashboard');
    } else if (existingUser.role === 'doctor') {
      router.push('/doctor-dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    router.push('/login');
  };
  
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
