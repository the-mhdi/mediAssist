import AppLayout from "@/components/layout/app-layout";
import PatientDashboardClient from "@/components/patient/patient-dashboard-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Patient Dashboard - MediChat',
  description: 'Chat with our AI assistant for medical information.',
};

export default function PatientDashboardPage() {
  return (
    <AppLayout>
      <PatientDashboardClient />
    </AppLayout>
  );
}
