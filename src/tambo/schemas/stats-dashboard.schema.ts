import { z } from 'zod';

const stat = z.object({
  label: z.string().describe('What this stat measures'),
  value: z.string().describe('The display value, e.g. "94%", "$2.4M", "3.2x"'),
  change: z.string().optional().describe('Change indicator, e.g. "+12%", "-5%"'),
  trend: z.enum(['up', 'down', 'neutral']).optional().describe('Trend direction for color coding'),
  description: z.string().optional().describe('Brief context for this stat'),
});

export const statsDashboardSchema = z.object({
  title: z.string().describe('Dashboard title'),
  stats: z.array(stat).min(2).max(8).describe('Key metrics to display'),
  subtitle: z.string().optional().describe('Context or time period'),
  note: z.string().optional().describe('Optional footnote'),
});

export type StatsDashboardProps = z.infer<typeof statsDashboardSchema>;
