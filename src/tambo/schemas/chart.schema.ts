import { z } from 'zod';

const dataPoint = z.object({
  label: z.string().describe('Label for this data point'),
  value: z.number().describe('Numeric value'),
  color: z.string().optional().describe('Optional CSS color override'),
});

export const chartSchema = z.object({
  chartType: z.enum(['bar', 'horizontal-bar', 'line', 'pie', 'donut']).describe('Type of chart to render'),
  title: z.string().describe('Chart title'),
  data: z.array(dataPoint).min(2).max(12).describe('Data points to visualize'),
  subtitle: z.string().optional().describe('Optional subtitle or context'),
  valuePrefix: z.string().optional().describe('Prefix for values, e.g. "$"'),
  valueSuffix: z.string().optional().describe('Suffix for values, e.g. "%", "x", "M"'),
  note: z.string().optional().describe('Optional footnote or source'),
});

export type ChartDisplayProps = z.infer<typeof chartSchema>;
