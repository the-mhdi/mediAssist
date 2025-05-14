import AppLayout from "@/components/layout/app-layout";
import GeneratePatientProfileForm from "@/components/doctor/generate-patient-profile-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generate Patient Profile - MediChat',
  description: 'Create new patient profiles and generate login credentials.',
};

export default function GenerateProfilePage() {
  return (
    <AppLayout>
      <GeneratePatientProfileForm />
    </AppLayout>
  );
}
