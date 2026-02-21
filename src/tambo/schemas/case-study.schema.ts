import { z } from 'zod';

const metric = z.object({
  value: z.string().describe('The metric value, e.g. "40x" or "$12M"'),
  label: z.string().describe('What the metric measures'),
});

export const caseStudySchema = z.object({
  studies: z.array(z.object({
    category: z.string().describe('Industry or domain'),
    title: z.string().describe('Project title'),
    description: z.string().describe('2-4 sentence project summary'),
    metrics: z.array(metric).min(1).max(3),
    technologies: z.array(z.string()).optional().describe('Key technologies used'),
    duration: z.string().optional().describe('Project duration'),
  })).min(1).max(3),
  contextNote: z.string().optional().describe('Why these case studies are relevant'),
});

export type CaseStudyViewerProps = z.infer<typeof caseStudySchema>;
