import { z } from 'zod';

const phase = z.object({
  name: z.string().describe('Phase name, e.g. "Discovery & Assessment"'),
  duration: z.string().describe('Duration, e.g. "2 weeks"'),
  description: z.string().describe('What happens in this phase'),
  deliverables: z.array(z.string()).min(1).max(3),
  isCurrent: z.boolean().optional().describe('Highlight as the starting phase'),
});

export const timelineSchema = z.object({
  projectName: z.string().describe('Name for the estimated project'),
  totalDuration: z.string().describe('Total estimated duration'),
  phases: z.array(phase).min(3).max(6),
  note: z.string().optional().describe('Caveat about the timeline being an estimate'),
});

export type TimelineEstimatorProps = z.infer<typeof timelineSchema>;
