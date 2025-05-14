
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { PatientProfile } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, UserPlus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { addPatientProfile, type AddPatientProfileData } from "@/services/patientService";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  dateOfBirth: z.date({ required_error: "Date of birth is required."}),
  medicalHistorySummary: z.string().optional(),
});

export default function GeneratePatientProfileForm() {
  const { toast } = useToast();
  const [generatedProfile, setGeneratedProfile] = useState<PatientProfile | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      dateOfBirth: undefined,
      medicalHistorySummary: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const profileData: AddPatientProfileData = {
      name: values.name,
      email: values.email,
      dateOfBirth: values.dateOfBirth, // Pass as Date object
      medicalHistorySummary: values.medicalHistorySummary || undefined, // Pass undefined if empty
    };

    try {
      const newProfile = await addPatientProfile(profileData);
      setGeneratedProfile(newProfile);
      toast({
        title: "Patient Profile Generated!",
        description: `Profile for ${values.name} created successfully.`,
      });
      form.reset(); 
    } catch (error) {
      console.error("Failed to generate profile:", error);
      toast({
        title: "Error",
        description: "Could not generate patient profile.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center"><UserPlus className="mr-2 h-6 w-6 text-primary"/> Generate New Patient Profile</CardTitle>
        <CardDescription>
          Create a new profile for a patient. Their login credentials will be generated.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
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
                  <FormLabel>Patient Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="patient@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    This email will be used for patient login.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medicalHistorySummary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical History Summary (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief summary of known conditions, allergies, etc."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Generating...' : 'Generate Profile & Credentials'}
            </Button>
          </form>
        </Form>

        {generatedProfile && (
          <Card className="mt-8 bg-secondary/50">
            <CardHeader>
              <CardTitle className="text-lg">Generated Credentials for {generatedProfile.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Email:</strong> {generatedProfile.email}</p>
              <p><strong>Temporary Password:</strong> <span className="font-mono bg-muted p-1 rounded">{generatedProfile.generatedPassword}</span></p>
              <p className="text-sm text-muted-foreground">
                Please share these credentials securely with the patient. They should change their password upon first login (feature not implemented).
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
