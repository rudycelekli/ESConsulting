import { z } from 'zod';

export const roiCalculatorSchema = z.object({
  projectType: z.enum([
    'llm-application', 'computer-vision', 'predictive-analytics',
    'ai-infrastructure', 'ai-strategy', 'custom',
  ]).describe('Type of AI project being estimated'),
  estimatedInvestment: z.object({
    low: z.number().describe('Low-end investment estimate in USD'),
    high: z.number().describe('High-end investment estimate in USD'),
  }),
  projectedSavings: z.object({
    annual: z.number().describe('Projected annual savings or revenue impact in USD'),
    timeToValue: z.string().describe('Estimated time to see returns, e.g. "3-6 months"'),
  }),
  assumptions: z.array(z.string()).min(1).max(4).describe('Key assumptions behind the estimate'),
  disclaimer: z.string().optional().describe('Brief disclaimer about estimates being illustrative'),
});

export type ROICalculatorProps = z.infer<typeof roiCalculatorSchema>;
