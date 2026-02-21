import { z } from 'zod';

const comparisonColumn = z.object({
  header: z.string().describe('Column header / option name'),
  subheader: z.string().optional().describe('Subtitle like price or category'),
  values: z.array(z.string()).describe('Values for each row, in order matching rowLabels'),
  highlighted: z.boolean().optional().describe('Whether this column is the recommended option'),
});

export const comparisonSchema = z.object({
  title: z.string().describe('Title for the comparison'),
  rowLabels: z.array(z.string()).min(2).max(10).describe('Row labels (feature names / criteria)'),
  columns: z.array(comparisonColumn).min(2).max(4).describe('Columns to compare (options)'),
  note: z.string().optional().describe('Optional conclusion or recommendation note'),
});

export type ComparisonTableProps = z.infer<typeof comparisonSchema>;
