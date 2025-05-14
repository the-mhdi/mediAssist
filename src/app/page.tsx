import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, LogIn, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-6">
      <Card className="w-full max-w-md shadow-2xl overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-8 text-center">
          <HeartPulse className="w-16 h-16 mx-auto mb-4" />
          <CardTitle className="text-4xl font-bold">MediChat</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-lg mt-2">
            Your AI Powered Medical Assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-8 text-base">
            Connect with healthcare like never before. Whether you're a patient seeking guidance or a doctor managing care, MediChat is here to help.
          </p>
          <Image 
            src="https://placehold.co/600x400.png" 
            alt="Healthcare illustration" 
            width={600} 
            height={400} 
            className="rounded-lg mb-8 shadow-md"
            data-ai-hint="medical technology"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/login">
                <LogIn className="mr-2 h-5 w-5" /> Login
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full border-primary text-primary hover:bg-primary/10">
              <Link href="/signup">
                <UserPlus className="mr-2 h-5 w-5" /> Sign Up
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-secondary/50 text-center">
          <p className="text-xs text-muted-foreground w-full">
            &copy; {new Date().getFullYear()} MediChat. Revolutionizing healthcare communication.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
