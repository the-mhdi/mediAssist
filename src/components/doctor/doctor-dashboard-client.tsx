"use client";

import PatientList from "./patient-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorDashboardClient() {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading user data...</p>; // Or a more sophisticated loader
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome, {user.name || 'Doctor'}!</CardTitle>
          <CardDescription className="text-base">
            This is your MediChat dashboard. Here you can manage your patients, generate new patient profiles, and view their documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Button asChild size="lg">
            <Link href="/doctor-dashboard/generate-profile">
              <UserPlus className="mr-2 h-5 w-5" /> Create New Patient Profile
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <PatientList />
    </div>
  );
}
