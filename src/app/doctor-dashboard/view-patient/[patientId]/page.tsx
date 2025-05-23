
"use client"; 

import AppLayout from "@/components/layout/app-layout";
import DocumentUploadForm from "@/components/doctor/document-upload-form";
import DoctorPatientChatInterface from "@/components/doctor/doctor-patient-chat-interface";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import type { PatientProfile, PatientDocument } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, CalendarDays, Mail, FileText, BriefcaseMedical, Trash2, Eye, BotMessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { getPatientById, getDocumentsByPatientId, deletePatientDocument } from "@/services/patientService";

export default function ViewPatientPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadPatientData = useCallback(async () => {
    if (patientId) {
      setIsLoading(true);
      try {
        const fetchedPatient = await getPatientById(patientId);
        setPatient(fetchedPatient);
        if (fetchedPatient) {
          const fetchedDocuments = await getDocumentsByPatientId(patientId);
          setDocuments(fetchedDocuments);
        } else {
          setDocuments([]); // No patient, no documents
        }
      } catch (error) {
        console.error("Failed to load patient data:", error);
        toast({ title: "Error", description: "Could not load patient details.", variant: "destructive" });
        setPatient(null);
        setDocuments([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [patientId, toast]);

  useEffect(() => {
    loadPatientData();
  }, [loadPatientData]);

  const handleDocumentUploaded = (newDocument: PatientDocument) => {
    setDocuments(prevDocs => [newDocument, ...prevDocs]);
  };
  
  const handleDeleteDocument = async (docId: string, docName: string) => {
    try {
      const success = await deletePatientDocument(docId);
      if (success) {
        setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
        toast({ title: "Document Deleted", description: `Document "${docName}" has been removed.` });
      } else {
        toast({ title: "Deletion Failed", description: `Could not delete document "${docName}".`, variant: "destructive"});
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast({ title: "Error", description: "An error occurred while deleting the document.", variant: "destructive"});
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="text-center py-10">
          <svg className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-muted-foreground">Loading patient details...</p>
        </div>
      </AppLayout>
    );
  }

  if (!patient) {
    return (
      <AppLayout>
        <Card>
          <CardHeader>
            <CardTitle>Patient Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The patient profile could not be found. It may have been deleted or the ID is incorrect.</p>
             <Button asChild className="mt-4">
                <a href="/doctor-dashboard">Back to Patient List</a>
            </Button>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };


  return (
    <AppLayout>
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                 <Image src={`https://placehold.co/100x100.png?text=${getInitials(patient.name)}`} alt={patient.name} width={80} height={80} className="object-cover" data-ai-hint="profile avatar"/>
                <AvatarFallback className="text-3xl bg-secondary">{getInitials(patient.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl">{patient.name}</CardTitle>
                <CardDescription className="text-base">Patient ID: {patient.id}</CardDescription>
              </div>
            </div>
             <Badge variant="outline" className="text-sm py-1 px-3 mt-2 sm:mt-0">
                Profile Created: {patient.createdAt.toLocaleDateString()}
            </Badge>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-3 text-primary" />
                <span>Born on: {patient.dateOfBirth.toLocaleDateString()}</span>
              </div>
            </div>
            <div className="space-y-3">
               <div className="flex items-start">
                <BriefcaseMedical className="h-5 w-5 mr-3 text-primary shrink-0 mt-1" />
                <div>
                    <h4 className="font-semibold">Medical History Summary:</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{patient.medicalHistorySummary || "No summary provided."}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/>Patient Documents</CardTitle>
                <CardDescription>View and manage documents for {patient.name}. Patients cannot see these documents.</CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Uploaded On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map(doc => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.fileName}</TableCell>
                          <TableCell><Badge variant="secondary">{doc.fileType.split('/')[1] || doc.fileType}</Badge></TableCell>
                          <TableCell>{doc.uploadDate.toLocaleDateString()}</TableCell>
                          <TableCell className="text-right space-x-2">
                             <Button variant="outline" size="sm" onClick={() => window.open(doc.url, '_blank')} disabled={doc.url === '#' || !doc.url}>
                                <Eye className="mr-1 h-3 w-3" /> View
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteDocument(doc.id, doc.fileName)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No documents uploaded for this patient yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <DocumentUploadForm patientId={patient.id} patientName={patient.name} onDocumentUploaded={handleDocumentUploaded} />
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <BotMessageSquare className="mr-2 h-5 w-5 text-primary"/> Configure Patient AI Assistant
            </CardTitle>
            <CardDescription>
              Interact with the AI to set context, prompts, or guidelines for {patient.name}'s chat experience. This information will (notionally) be used by the patient's AI assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DoctorPatientChatInterface patientId={patient.id} patientName={patient.name} />
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
