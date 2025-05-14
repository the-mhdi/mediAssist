"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileText, X } from "lucide-react";
import type { PatientDocument } from "@/lib/types";

interface DocumentUploadFormProps {
  patientId: string;
  patientName: string;
  onDocumentUploaded: (document: PatientDocument) => void;
}

export default function DocumentUploadForm({ patientId, patientName, onDocumentUploaded }: DocumentUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newDocument: PatientDocument = {
      id: `doc-${Date.now().toString().slice(-6)}`,
      patientId,
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      uploadDate: new Date().toISOString(),
      url: URL.createObjectURL(selectedFile), // Mock URL, browser-specific
    };
    
    onDocumentUploaded(newDocument);

    toast({
      title: "Upload Successful (Mock)",
      description: `Document "${selectedFile.name}" uploaded for ${patientName}.`,
    });
    
    setSelectedFile(null); 
    // Clear the actual input field value
    const fileInput = document.getElementById('document-upload-input') as HTMLInputElement;
    if(fileInput) fileInput.value = "";

    setIsUploading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center"><UploadCloud className="mr-2 h-5 w-5 text-primary"/>Upload Patient Document</CardTitle>
        <CardDescription>
          Select a document to upload for {patientName}. (Max 10MB, PDF, DOCX, JPG, PNG) - Mocked
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="document-upload-input" className="sr-only">Choose file</Label>
            <Input 
              id="document-upload-input" 
              type="file" 
              onChange={handleFileChange} 
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              disabled={isUploading}
            />
          </div>
          {selectedFile && (
            <div className="mt-2 p-3 border rounded-md bg-muted/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => setSelectedFile(null)} disabled={isUploading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!selectedFile || isUploading}>
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
