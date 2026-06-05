import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['en', 'ar']),
    itemSlug: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('General'),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
    images: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })).default([]),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['en', 'ar']),
    itemSlug: z.string(),
    repoName: z.string().optional(),
    repo: z.string().url().optional(),
    docs: z.string().url().optional(),
    category: z.string().default('Security Tooling'),
    status: z.enum(['active', 'wip', 'archived']).default('active'),
    tags: z.array(z.string()).default([]),
    tech: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    cover: z.string().optional(),
    icon: z.string().optional(),
    safety: z.enum(['defensive', 'authorized-testing-only', 'educational-only']).default('defensive'),
  }),
});

const presentations = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['en', 'ar']),
    itemSlug: z.string(),
    category: z.string().default('Cyber Station Lectures'),
    tags: z.array(z.string()).default([]),
    sourceRepo: z.string().url().optional(),
    sourceFolder: z.string().url().optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    session: z.number().optional(),
  }),
});

export const collections = { articles, projects, presentations };
