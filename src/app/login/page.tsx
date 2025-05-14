import { LoginForm } from "@/components/auth/login-form";
import { HeartPulse } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-4 sm:p-6">
      <div className="text-center mb-8">
        <HeartPulse className="w-16 h-16 mx-auto mb-2 text-primary" />
        <h1 className="text-4xl font-bold text-primary">MediChat</h1>
        <p className="text-muted-foreground">Welcome back! Please log in.</p>
      </div>
      <LoginForm />
    </div>
  );
}
