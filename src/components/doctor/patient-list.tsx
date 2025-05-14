"use client";

import { useState, useEffect } from "react";
import type { PatientProfile } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FilePlus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";


// Mock data for patients
const mockPatients: PatientProfile[] = [
  { id: "pat001", name: "Alice Wonderland", email: "alice@example.com", dateOfBirth: "1990-05-15", medicalHistorySummary: "Asthma, seasonal allergies.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
  { id: "pat002", name: "Bob The Builder", email: "bob@example.com", dateOfBirth: "1985-11-20", medicalHistorySummary: "Hypertension, controlled with medication.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() },
  { id: "pat003", name: "Charlie Brown", email: "charlie@example.com", dateOfBirth: "2000-01-10", medicalHistorySummary: "Generally healthy, occasional sports injuries.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
  { id: "pat004", name: "Diana Prince", email: "diana@example.com", dateOfBirth: "1978-07-04", medicalHistorySummary: "Type 2 Diabetes, well-managed.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString() },
];


export default function PatientList() {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setPatients(mockPatients);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleDeletePatient = (patientId: string) => {
    // Mock deletion
    setPatients(prevPatients => prevPatients.filter(p => p.id !== patientId));
    toast({
      title: "Patient Profile Deleted",
      description: `Profile for patient ID ${patientId} has been removed. (Mocked)`,
    });
  };

  if (isLoading) {
    return <Card><CardHeader><CardTitle>Loading Patients...</CardTitle></CardHeader><CardContent><p>Please wait while we fetch patient data.</p></CardContent></Card>;
  }

  if (patients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Patients Found</CardTitle>
          <CardDescription>You currently do not have any patients assigned or created.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/doctor-dashboard/generate-profile">
              <FilePlus className="mr-2 h-4 w-4" /> Create New Patient Profile
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Patients</CardTitle>
        <CardDescription>Manage your patient profiles and their documents.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{new Date(patient.dateOfBirth).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/doctor-dashboard/view-patient/${patient.id}`}>
                      <Eye className="mr-1 h-4 w-4" /> View
                    </Link>
                  </Button>
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-4 w-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the patient profile for {patient.name}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeletePatient(patient.id)}>
                          Yes, delete profile
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
