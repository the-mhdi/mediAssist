
'use server';
/**
 * @fileOverview A patient chat AI agent.
 *
 * - getPatientAIChatResponse - A function that handles the patient chat AI responses.
 * - PatientChatInput - The input type for the getPatientAIChatResponse function.
 * - PatientChatOutput - The return type for the getPatientAIChatResponse function.
 */

import { ai } from '@/ai/genkit';
import type { ChatMessageInput } from '@/lib/types';
import { z } from 'genkit';

const ChatMessageSchema = z.object({
  id: z.string(),
  sender: z.enum(['user', 'ai']),
  text: z.string(),
  timestamp: z.string().describe("ISO date string for the message timestamp."),
});

const PatientChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe("The history of the conversation so far."),
  currentMessage: z.string().describe("The latest message from the user."),
  patientName: z.string().optional().describe("The name of the patient, if available."),
});
export type PatientChatInput = z.infer<typeof PatientChatInputSchema>;

const PatientChatOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user's message."),
});
export type PatientChatOutput = z.infer<typeof PatientChatOutputSchema>;


export async function getPatientAIChatResponse(input: PatientChatInput): Promise<PatientChatOutput> {
  return patientChatFlow(input);
}

const patientChatPrompt = ai.definePrompt({
  name: 'patientChatPrompt',
  input: { schema: PatientChatInputSchema },
  output: { schema: PatientChatOutputSchema },
  prompt: `You are MediChat, a friendly and helpful AI medical assistant.
Your goal is to provide general medical information and support to users.
{{#if patientName}}
You are speaking to {{patientName}}.
{{else}}
You are speaking to a user.
{{/if}}

IMPORTANT: You must ALWAYS include the following disclaimer at the end of your response, on a new line:
"Please remember, I am an AI assistant and not a real doctor. My advice is not a substitute for professional medical care. Always consult with a qualified healthcare provider for any medical concerns."

Conversation History (if any):
{{#each history}}
{{#if (eq sender "user")}}- User (at {{timestamp}}): {{{text}}}
{{else}}- AI (at {{timestamp}}): {{{text}}}
{{/if}}
{{/each}}

Current User Message:
{{{currentMessage}}}

Based on the conversation history and the current user message, provide a helpful and empathetic response.
If the user asks for a diagnosis or treatment for a specific condition, gently decline and advise them to see a doctor.
Do not attempt to prescribe medication.
If the query is very general (e.g. "What is a headache?"), you can provide general information.
Keep your responses concise and easy to understand.
`,
});

const patientChatFlow = ai.defineFlow(
  {
    name: 'patientChatFlow',
    inputSchema: PatientChatInputSchema,
    outputSchema: PatientChatOutputSchema,
  },
  async (input) => {
    const { output } = await patientChatPrompt(input);
    if (!output) {
      return { response: "I'm sorry, I wasn't able to generate a response. Please try again." };
    }
    // Ensure the disclaimer is present
    const disclaimer = "Please remember, I am an AI assistant and not a real doctor. My advice is not a substitute for professional medical care. Always consult with a qualified healthcare provider for any medical concerns.";
    if (!output.response.includes(disclaimer)) {
      return { response: `${output.response.trim()}\n\n${disclaimer}` };
    }
    return output;
  }
);

