
// src/services/patientService.ts
import type { PatientProfile, PatientDocument } from '@/lib/types';

// Mock data storage
let mockPatients: PatientProfile[] = [
  { id: "pat001", name: "Alice Wonderland", email: "alice@example.com", dateOfBirth: new Date("1990-05-15").toISOString(), medicalHistorySummary: "Asthma, seasonal allergies.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
  { id: "pat002", name: "Bob The Builder", email: "bob@example.com", dateOfBirth: new Date("1985-11-20").toISOString(), medicalHistorySummary: "Hypertension, controlled with medication.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() },
  { id: "pat003", name: "Charlie Brown", email: "charlie@example.com", dateOfBirth: new Date("2000-01-10").toISOString(), medicalHistorySummary: "Generally healthy, occasional sports injuries.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
  { id: "pat004", name: "Diana Prince", email: "diana@example.com", dateOfBirth: new Date("1978-07-04").toISOString(), medicalHistorySummary: "Type 2 Diabetes, well-managed.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString() },
];

let mockDocuments: PatientDocument[] = [
    { id: "doc001", patientId: "pat001", fileName: "blood_test_results.pdf", uploadDate: new Date("2023-06-15T10:00:00Z").toISOString(), url: "#", fileType: "application/pdf" },
    { id: "doc002", patientId: "pat001", fileName: "xray_chest.jpg", uploadDate: new Date("2023-07-01T14:30:00Z").toISOString(), url: "#", fileType: "image/jpeg" },
    { id: "doc003", patientId: "pat002", fileName: "prescription_lisinopril.pdf", uploadDate: new Date("2023-08-01T09:00:00Z").toISOString(), url: "#", fileType: "application/pdf" },
];

const generatePassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};


export const getPatients = async (): Promise<PatientProfile[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockPatients]; // Return a copy
};

export const getPatientById = async (patientId: string): Promise<PatientProfile | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const patient = mockPatients.find(p => p.id === patientId);
  return patient ? {...patient} : null; // Return a copy
};

export const getDocumentsByPatientId = async (patientId: string): Promise<PatientDocument[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDocuments.filter(doc => doc.patientId === patientId).map(doc => ({...doc})); // Return copies
};

export type AddPatientDocumentData = Omit<PatientDocument, 'id' | 'patientId' | 'uploadDate'>;

export const addPatientDocument = async (patientId: string, documentData: AddPatientDocumentData): Promise<PatientDocument> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newDoc: PatientDocument = {
        id: `doc-${Date.now().toString().slice(-6)}`,
        patientId,
        fileName: documentData.fileName,
        fileType: documentData.fileType,
        uploadDate: new Date().toISOString(),
        url: documentData.url, 
    };
    mockDocuments.push(newDoc);
    return {...newDoc}; // Return a copy
};

export const deletePatientDocument = async (documentId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const initialLength = mockDocuments.length;
    mockDocuments = mockDocuments.filter(doc => doc.id !== documentId);
    return mockDocuments.length < initialLength;
};

export type AddPatientProfileData = Omit<PatientProfile, 'id' | 'createdAt' | 'generatedPassword' | 'dateOfBirth'> & { dateOfBirth: Date, medicalHistorySummary?: string };

export const addPatientProfile = async (profileData: AddPatientProfileData): Promise<PatientProfile> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPassword = generatePassword();
    const newProfile: PatientProfile = {
        id: `pat-${Date.now().toString().slice(-6)}`,
        name: profileData.name,
        email: profileData.email,
        dateOfBirth: profileData.dateOfBirth.toISOString(),
        medicalHistorySummary: profileData.medicalHistorySummary || "",
        generatedPassword: newPassword,
        createdAt: new Date().toISOString(),
    };
    mockPatients.push(newProfile);
    return {...newProfile}; // Return a copy
};

export const deletePatientProfile = async (patientId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const initialLength = mockPatients.length;
    mockPatients = mockPatients.filter(p => p.id !== patientId);
    if (mockPatients.length < initialLength) {
        // Also delete associated documents
        mockDocuments = mockDocuments.filter(doc => doc.patientId !== patientId);
        return true;
    }
    return false;
};

// Function to reset mock data for testing or specific scenarios if needed
export const resetMockData = () => {
  mockPatients = [
    { id: "pat001", name: "Alice Wonderland", email: "alice@example.com", dateOfBirth: new Date("1990-05-15").toISOString(), medicalHistorySummary: "Asthma, seasonal allergies.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
    { id: "pat002", name: "Bob The Builder", email: "bob@example.com", dateOfBirth: new Date("1985-11-20").toISOString(), medicalHistorySummary: "Hypertension, controlled with medication.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() },
    { id: "pat003", name: "Charlie Brown", email: "charlie@example.com", dateOfBirth: new Date("2000-01-10").toISOString(), medicalHistorySummary: "Generally healthy, occasional sports injuries.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
    { id: "pat004", name: "Diana Prince", email: "diana@example.com", dateOfBirth: new Date("1978-07-04").toISOString(), medicalHistorySummary: "Type 2 Diabetes, well-managed.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString() },
  ];
  mockDocuments = [
    { id: "doc001", patientId: "pat001", fileName: "blood_test_results.pdf", uploadDate: new Date("2023-06-15T10:00:00Z").toISOString(), url: "#", fileType: "application/pdf" },
    { id: "doc002", patientId: "pat001", fileName: "xray_chest.jpg", uploadDate: new Date("2023-07-01T14:30:00Z").toISOString(), url: "#", fileType: "image/jpeg" },
    { id: "doc003", patientId: "pat002", fileName: "prescription_lisinopril.pdf", uploadDate: new Date("2023-08-01T09:00:00Z").toISOString(), url: "#", fileType: "application/pdf" },
  ];
};
