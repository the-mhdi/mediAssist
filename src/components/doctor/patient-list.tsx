
"use client";

import { useState, useEffect } from "react";
import type { PatientProfile } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FilePlus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getPatients, deletePatientProfile } from "@/services/patientService";


export default function PatientList() {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const fetchedPatients = await getPatients();
        setPatients(fetchedPatients);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
        toast({
          title: "Error",
          description: "Could not load patient list.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, [toast]);

  const handleDeletePatient = async (patientId: string, patientName: string) => {
    try {
      const success = await deletePatientProfile(patientId);
      if (success) {
        setPatients(prevPatients => prevPatients.filter(p => p.id !== patientId));
        toast({
          title: "Patient Profile Deleted",
          description: `Profile for ${patientName} has been removed.`,
        });
      } else {
        toast({
          title: "Deletion Failed",
          description: `Could not delete profile for ${patientName}.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete patient:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the patient profile.",
        variant: "destructive",
      });
    }
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
                        <AlertDialogAction onClick={() => handleDeletePatient(patient.id, patient.name)}>
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
