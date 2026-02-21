import { z } from 'zod';

const technology = z.object({
  name: z.string().describe('Technology name, e.g. "LangChain"'),
  category: z.enum([
    'model', 'framework', 'infrastructure', 'database',
    'monitoring', 'deployment', 'security', 'data-pipeline',
  ]),
  rationale: z.string().describe('Why this technology is recommended'),
  alternatives: z.array(z.string()).optional().describe('Alternative options'),
});

export const techStackSchema = z.object({
  useCase: z.string().describe('The use case this stack is recommended for'),
  technologies: z.array(technology).min(3).max(8),
  architectureNote: z.string().optional().describe('How these technologies fit together'),
});

export type TechStackDisplayProps = z.infer<typeof techStackSchema>;
