export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface Patient extends User {
  role: 'patient';
  assignedDoctorId?: string;
  // other patient-specific fields
}

export interface Doctor extends User {
  role: 'doctor';
  // other doctor-specific fields
}

export interface PatientProfile {
  id: string;
  name: string;
  email: string; // for login
  dateOfBirth: Date; // Changed from string to Date
  generatedPassword?: string; // for login, to be shown to doctor
  medicalHistorySummary?: string | null; // Prisma optional string can be null
  createdAt: Date; // Changed from string to Date
}

export interface PatientDocument {
  id:string;
  patientId: string;
  fileName: string;
  uploadDate: Date; // Changed from string to Date
  url: string; 
  fileType: string;
}

// For chat messages
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

// For Genkit flow input, ensures serializability
export interface ChatMessageInput extends Omit<ChatMessage, 'timestamp'> {
  timestamp: string; // Store timestamp as ISO string for flow input
}
