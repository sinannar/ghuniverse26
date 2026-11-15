import { defineCollection, z } from 'astro:content';
import { topics } from './data/topics';

const topicsCollection = defineCollection({
  loader: async () => topics,
  schema: z.object({
    category: z.enum(['octoverse', 'platform', 'copilot']),
    title: z.string().min(1),
    headline: z.string().min(1),
    summary: z.string().min(1),
    takeaway: z.string().min(1),
    points: z.array(z.object({ title: z.string(), text: z.string() })).min(1),
    flow: z.array(z.string()).optional(),
    demo: z.object({ tool: z.string(), cue: z.string(), optional: z.boolean() }).optional(),
    creationStory: z.string().optional(),
    charts: z.array(z.object({
      title: z.string(),
      unit: z.string(),
      rows: z.array(z.object({
        label: z.string(),
        value: z.number().nonnegative(),
        display: z.string(),
        comparison: z.boolean().optional(),
      })).min(1),
      note: z.string(),
    })).optional(),
    examples: z.array(z.object({
      name: z.string(), description: z.string(), url: z.string().url(),
    })).optional(),
    caveat: z.string().optional(),
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).min(1),
  }),
});

export const collections = { topics: topicsCollection };
