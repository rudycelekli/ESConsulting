import { z } from 'zod';
import { ServiceCard } from './components/ServiceCard';
import { ROICalculator } from './components/ROICalculator';
import { CaseStudyViewer } from './components/CaseStudyViewer';
import { ContactForm } from './components/ContactForm';
import { TimelineEstimator } from './components/TimelineEstimator';
import { TechStackDisplay } from './components/TechStackDisplay';
import { serviceCardSchema } from './schemas/service-card.schema';
import { roiCalculatorSchema } from './schemas/roi-calculator.schema';
import { caseStudySchema } from './schemas/case-study.schema';
import { contactFormSchema } from './schemas/contact-form.schema';
import { timelineSchema } from './schemas/timeline.schema';
import { techStackSchema } from './schemas/tech-stack.schema';

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
