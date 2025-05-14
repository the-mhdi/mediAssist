import AppLayout from "@/components/layout/app-layout";
import DoctorDashboardClient from "@/components/doctor/doctor-dashboard-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Doctor Dashboard - MediChat',
  description: 'Manage your patients and their records.',
};

export default function DoctorDashboardPage() {
  return (
    <AppLayout>
      <DoctorDashboardClient />
    </AppLayout>
  );
}
