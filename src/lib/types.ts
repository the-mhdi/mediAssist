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
  dateOfBirth: string;
  generatedPassword?: string; // for login, to be shown to doctor
  medicalHistorySummary?: string; // entered by doctor
  createdAt: string;
}

export interface PatientDocument {
  id:string;
  patientId: string;
  fileName: string;
  uploadDate: string;
  url: string; // mock URL
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
