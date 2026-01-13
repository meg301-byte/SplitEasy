'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestExpensesInputSchema = z.object({
  eventName: z.string().describe('The name of the event.'),
  participants: z
    .array(z.string())
    .describe('A list of participant names in the event.'),
});

export type SuggestExpensesInput = z.infer<typeof SuggestExpensesInputSchema>;

const SuggestExpensesOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggested expense descriptions (e.g., "Pizza", "Movie Tickets", "Gas").'),
});

export type SuggestExpensesOutput = z.infer<
  typeof SuggestExpensesOutputSchema
>;

export async function suggestExpenses(
  input: SuggestExpensesInput
): Promise<SuggestExpensesOutput> {
  return suggestExpensesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestExpensesPrompt',
  input: { schema: SuggestExpensesInputSchema },
  output: { schema: SuggestExpensesOutputSchema },
  prompt: `You are an expert in event planning and expense management. Based on the event name and participant list, suggest a list of potential expenses that need to be split.

Provide a list of concise, one-or-two-word expense descriptions.

Event Name: {{{eventName}}}
Participants: {{{participants}}}
`,
});

const suggestExpensesFlow = ai.defineFlow(
  {
    name: 'suggestExpensesFlow',
    inputSchema: SuggestExpensesInputSchema,
    outputSchema: SuggestExpensesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
