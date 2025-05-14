
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bot, CornerDownLeft, UserCog } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

interface DoctorPatientChatInterfaceProps {
  patientName: string;
  patientId: string;
}

export default function DoctorPatientChatInterface({ patientName, patientId }: DoctorPatientChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: "1", 
      sender: "ai", 
      text: `You are configuring the AI assistant for ${patientName}. Enter prompts, guidelines, or key information you want the AI to use when ${patientName} interacts with it. For example, you could specify topics to focus on or avoid.`, 
      timestamp: new Date() 
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);
    const doctorMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user", // 'user' here represents the doctor
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, doctorMessage]);
    setInputValue("");

    // Simulate AI response acknowledging the doctor's input
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: "ai",
      text: `Input received: "${doctorMessage.text}". This information will be (notionally) stored and used to guide ${patientName}'s AI chat experience. (This is a mock interaction for demonstration).`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiResponse]);
    setIsSending(false);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-20rem)] max-h-[500px] bg-card rounded-lg border">
      <ScrollArea className="flex-1 p-4 space-y-4" ref={scrollAreaRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-end space-x-2",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.sender === "ai" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot size={18} />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-xs lg:max-w-md p-3 rounded-lg shadow",
                message.sender === "user"
                  ? "bg-accent text-accent-foreground rounded-br-none" 
                  : "bg-secondary text-secondary-foreground rounded-bl-none"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p className={cn(
                "text-xs mt-1",
                message.sender === "user" ? "text-accent-foreground/70 text-right" : "text-muted-foreground/70 text-left"
              )}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
             {message.sender === "user" && ( 
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-600 text-white"> {/* Distinct avatar for doctor */}
                  <UserCog size={18} />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isSending && messages[messages.length -1].sender === 'user' && (
           <div className="flex items-end space-x-2 justify-start">
             <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot size={18} />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-xs lg:max-w-md p-3 rounded-lg shadow bg-secondary text-secondary-foreground rounded-bl-none">
                <p className="text-sm">Thinking...</p>
              </div>
           </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex items-center p-4 border-t">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Set AI context for ${patientName}...`}
          className="flex-1 mr-2 text-base"
          aria-label="Doctor AI chat input"
          disabled={isSending}
        />
        <Button type="submit" size="icon" aria-label="Send message to configure AI" disabled={isSending || !inputValue.trim()}>
          <CornerDownLeft size={20} />
        </Button>
      </form>
    </div>
  );
}
