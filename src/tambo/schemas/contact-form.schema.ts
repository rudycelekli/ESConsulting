import { z } from 'zod';

export const contactFormSchema = z.object({
  prefilledName: z.string().optional().describe('User name if mentioned in conversation'),
  prefilledEmail: z.string().optional().describe('User email if mentioned'),
  prefilledCompany: z.string().optional().describe('Company name if mentioned'),
  prefilledMessage: z.string().describe('Suggested message summarizing the discussion, written in first person'),
  suggestedSubject: z.string().describe('Concise subject line for the inquiry'),
  urgency: z.enum(['exploratory', 'active-evaluation', 'urgent']).optional().describe('Inferred urgency level'),
});

export type ContactFormProps = z.infer<typeof contactFormSchema>;
