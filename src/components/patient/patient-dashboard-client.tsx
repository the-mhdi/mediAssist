"use client";

import ChatInterface from "./chat-interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientDashboardClient() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">AI Chat Assistant</CardTitle>
          <CardDescription>
            Ask questions about your health, symptoms, or get general medical information. This AI is for informational purposes only and does not replace professional medical advice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChatInterface />
        </CardContent>
      </Card>
    </div>
  );
}
