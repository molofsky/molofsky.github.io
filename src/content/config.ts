import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),          // 1–2 lines, used in cards/OG
    tags: z.array(z.string()).default([]),
    role: z.string().optional(),      // "Solo", "Lead", "Contributor"
    date: z.string().optional(),      // ISO; sorts newest first
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    cover: z.string().optional(),     // /assets/...
    results: z.array(z.string()).default([]), // bullets with metrics
  }),
});

export const collections = { projects };
