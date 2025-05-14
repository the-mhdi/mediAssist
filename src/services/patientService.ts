import { prisma } from '@/lib/db';
import type { PatientProfile, PatientDocument } from '@/lib/types';

const generatePassword = (length = 12): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export const getPatients = async (): Promise<PatientProfile[]> => {
  return prisma.patientProfile.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getPatientById = async (patientId: string): Promise<PatientProfile | null> => {
  return prisma.patientProfile.findUnique({
    where: { id: patientId },
  });
};

export const getDocumentsByPatientId = async (patientId: string): Promise<PatientDocument[]> => {
  return prisma.patientDocument.findMany({
    where: { patientId },
    orderBy: {
      uploadDate: 'desc',
    },
  });
};

export type AddPatientDocumentData = Omit<PatientDocument, 'id' | 'patientId' | 'uploadDate'>;

export const addPatientDocument = async (patientId: string, documentData: AddPatientDocumentData): Promise<PatientDocument> => {
  return prisma.patientDocument.create({
    data: {
      fileName: documentData.fileName,
      fileType: documentData.fileType,
      url: documentData.url, // In a real app, this URL would come from a file storage service
      patient: {
        connect: { id: patientId },
      },
    },
  });
};

export const deletePatientDocument = async (documentId: string): Promise<boolean> => {
  try {
    await prisma.patientDocument.delete({
      where: { id: documentId },
    });
    return true;
  } catch (error) {
    // Handle specific errors, e.g., P2025 (Record to delete does not exist)
    console.error("Error deleting document:", error);
    return false;
  }
};

// Ensure AddPatientProfileData matches the expected input for creation
export type AddPatientProfileData = {
  name: string;
  email: string;
  dateOfBirth: Date;
  medicalHistorySummary?: string;
};

export const addPatientProfile = async (profileData: AddPatientProfileData): Promise<PatientProfile & { generatedPassword?: string }> => {
  const newPassword = generatePassword();
  const newProfile = await prisma.patientProfile.create({
    data: {
      name: profileData.name,
      email: profileData.email,
      dateOfBirth: profileData.dateOfBirth, // Prisma expects DateTime, JS Date is fine
      medicalHistorySummary: profileData.medicalHistorySummary,
      generatedPassword: newPassword,
    },
  });
  // Return the full profile including the generated password for display to the doctor
  return { ...newProfile, generatedPassword: newPassword };
};

export const deletePatientProfile = async (patientId: string): Promise<boolean> => {
  // Prisma's 'onDelete: Cascade' in schema.prisma will handle deleting associated documents.
  try {
    await prisma.patientProfile.delete({
      where: { id: patientId },
    });
    return true;
  } catch (error) {
    console.error("Error deleting patient profile:", error);
    return false;
  }
};
