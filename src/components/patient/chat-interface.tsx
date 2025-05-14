
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage, ChatMessageInput } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bot, CornerDownLeft, User } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { getPatientAIChatResponse } from "@/ai/flows/patient-chat-flow";
import { useAuth } from "@/contexts/auth-context";


export default function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "ai", text: "Hello! I'm MediChat, your AI assistant. How can I help you today?", timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Prepare history for AI - convert Date to ISO string
    const historyInput: ChatMessageInput[] = messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
    }));
    
    try {
      const aiResult = await getPatientAIChatResponse({
        history: historyInput,
        currentMessage: userMessage.text,
        patientName: user?.name || undefined,
      });
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResult.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);

    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "I'm sorry, I encountered an error trying to respond. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[700px] bg-card shadow-lg rounded-lg border">
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
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-secondary text-secondary-foreground rounded-bl-none"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p className={cn(
                "text-xs mt-1",
                message.sender === "user" ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70 text-left"
              )}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
             {message.sender === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User size={18} />
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
                <p className="text-sm">MediChat is thinking...</p>
              </div>
           </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex items-center p-4 border-t">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 mr-2 text-base"
          aria-label="Chat message input"
          disabled={isSending}
        />
        <Button type="submit" size="icon" aria-label="Send message" disabled={isSending || !inputValue.trim()}>
          <CornerDownLeft size={20} />
        </Button>
      </form>
    </div>
  );
}
