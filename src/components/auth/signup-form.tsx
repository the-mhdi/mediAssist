"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserRole } from "@/lib/types";
import { useState } from "react";
import { Stethoscope, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function SignupForm() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth(); // Using login for mock registration
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedRole) {
      toast({
        title: "Role Selection Required",
        description: "Please select whether you are a Patient or a Doctor.",
        variant: "destructive",
      });
      return;
    }
    console.log("Signup attempt:", { ...values, role: selectedRole });
    // Simulate registration and login
    login(values.email, values.name, selectedRole);
    toast({
      title: "Signup Successful!",
      description: `Welcome, ${values.name}! You've been registered as a ${selectedRole}.`,
    });
    // AuthProvider will handle redirection
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create your MediChat Account</CardTitle>
        <CardDescription>Join us as a Patient or a Doctor.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Ada Lovelace" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>I am a...</FormLabel>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <Button
                  type="button"
                  variant={selectedRole === 'patient' ? 'default' : 'outline'}
                  onClick={() => setSelectedRole('patient')}
                  className="py-6 text-base"
                >
                  <User className="mr-2 h-5 w-5" /> Patient
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === 'doctor' ? 'default' : 'outline'}
                  onClick={() => setSelectedRole('doctor')}
                  className="py-6 text-base"
                >
                  <Stethoscope className="mr-2 h-5 w-5" /> Doctor
                </Button>
              </div>
               {form.formState.isSubmitted && !selectedRole && (
                <p className="text-sm font-medium text-destructive pt-2">Please select a role.</p>
              )}
            </FormItem>

            <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link href="/login">
              Log in
            </Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}
