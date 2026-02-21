import { z } from 'zod';
import { ServiceCard } from './components/ServiceCard';
import { ROICalculator } from './components/ROICalculator';
import { CaseStudyViewer } from './components/CaseStudyViewer';
import { ContactForm } from './components/ContactForm';
import { TimelineEstimator } from './components/TimelineEstimator';
import { TechStackDisplay } from './components/TechStackDisplay';
import { ChartDisplay } from './components/ChartDisplay';
import { ComparisonTable } from './components/ComparisonTable';
import { StatsDashboard } from './components/StatsDashboard';
import { serviceCardSchema } from './schemas/service-card.schema';
import { roiCalculatorSchema } from './schemas/roi-calculator.schema';
import { caseStudySchema } from './schemas/case-study.schema';
import { contactFormSchema } from './schemas/contact-form.schema';
import { timelineSchema } from './schemas/timeline.schema';
import { techStackSchema } from './schemas/tech-stack.schema';
import { chartSchema } from './schemas/chart.schema';
import { comparisonSchema } from './schemas/comparison.schema';
import { statsDashboardSchema } from './schemas/stats-dashboard.schema';

export const components = [
  {
    name: 'ServiceCard',
    description: 'Displays ES Consulting services relevant to the user query. Use when the user asks about what ES Consulting offers, specific AI capabilities, or how they can help with a particular problem.',
    component: ServiceCard,
    propsSchema: serviceCardSchema,
  },
  {
    name: 'ROICalculator',
    description: 'Estimates return on investment for an AI project. Use when the user asks about costs, ROI, pricing, budgets, or the business case for AI.',
    component: ROICalculator,
    propsSchema: roiCalculatorSchema,
  },
  {
    name: 'CaseStudyViewer',
    description: 'Displays case studies from ES Consulting past work. Use when the user asks for examples, proof, results, track record, or references.',
    component: CaseStudyViewer,
    propsSchema: caseStudySchema,
  },
  {
    name: 'ContactForm',
    description: 'A pre-filled contact form. Use when the user expresses interest in working together, wants to schedule a call, requests a proposal, or indicates intent to engage.',
    component: ContactForm,
    propsSchema: contactFormSchema,
  },
  {
    name: 'TimelineEstimator',
    description: 'Visualizes an estimated project timeline with phases. Use when the user asks how long a project takes, what the phases are, or wants to understand the engagement process.',
    component: TimelineEstimator,
    propsSchema: timelineSchema,
  },
  {
    name: 'TechStackDisplay',
    description: 'Shows a recommended technology stack for an AI project. Use when the user asks about technologies, frameworks, models, infrastructure, or technical approach.',
    component: TechStackDisplay,
    propsSchema: techStackSchema,
  },
  {
    name: 'ChartDisplay',
    description: 'Renders interactive charts and graphs: bar charts, horizontal bar charts, line charts, pie charts, and donut charts. Use this whenever the user asks for any kind of chart, graph, data visualization, visual comparison of numbers, trends, distributions, market data, statistics, benchmarks, or any request that would benefit from a visual data representation. Supports value prefixes ($) and suffixes (%, x, M). ALWAYS prefer rendering a chart over describing numbers in text.',
    component: ChartDisplay,
    propsSchema: chartSchema,
  },
  {
    name: 'ComparisonTable',
    description: 'Renders a side-by-side comparison table for evaluating options. Use when the user asks to compare technologies, vendors, approaches, frameworks, pricing tiers, service plans, pros/cons, or any scenario involving choosing between multiple options. Supports checkmarks, crosses, and highlighting a recommended column.',
    component: ComparisonTable,
    propsSchema: comparisonSchema,
  },
  {
    name: 'StatsDashboard',
    description: 'Renders a dashboard of key metrics with trend indicators. Use when the user asks for KPIs, performance metrics, statistics overview, market stats, industry benchmarks, adoption rates, or any collection of numbers that should be displayed as a clean dashboard with optional up/down trend arrows.',
    component: StatsDashboard,
    propsSchema: statsDashboardSchema,
  },
];

export const tools = [
  {
    name: 'getVisibleSection',
    description: 'Returns which section of the website the user is currently viewing.',
    tool: async () => {
      const sections = document.querySelectorAll('section[id]');
      let current = 'hero';
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
          current = section.id;
        }
      });
      return { currentSection: current };
    },
    inputSchema: z.object({}),
    outputSchema: z.object({ currentSection: z.string() }),
  },
  {
    name: 'scrollToSection',
    description: 'Scrolls the page to a specific section.',
    tool: async ({ sectionId }: { sectionId: string }) => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return { success: true, scrolledTo: sectionId };
      }
      return { success: false, scrolledTo: null };
    },
    inputSchema: z.object({
      sectionId: z.enum([
        'hero', 'clients', 'what-we-do', 'services',
        'why-us', 'case-studies', 'industries', 'contact',
      ]),
    }),
    outputSchema: z.object({ success: z.boolean(), scrolledTo: z.string().nullable() }),
  },
];
