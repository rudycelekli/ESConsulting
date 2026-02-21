import { z } from 'zod';

const singleService = z.object({
  id: z.string().describe('Unique identifier, e.g. "llm-genai"'),
  title: z.string().describe('Service name, e.g. "Foundation Models & GenAI"'),
  description: z.string().describe('1-3 sentence description of what this service delivers'),
  deliverables: z.array(z.string()).min(2).max(5).describe('Concrete deliverables'),
  tags: z.array(z.string()).min(1).max(4).describe('Short technology/domain tags'),
  relevanceNote: z.string().optional().describe('Why this service is relevant to the user query'),
});

export const serviceCardSchema = z.object({
  services: z.array(singleService).min(1).max(3).describe('1-3 most relevant services'),
  introText: z.string().optional().describe('Brief intro contextualizing the recommendations'),
});

export type ServiceCardProps = z.infer<typeof serviceCardSchema>;
