import { z } from "zod";

import { getSafeMarkdownUrl } from "@/lib/utils";

const safeImageUrlSchema = z
  .string()
  .trim()
  .max(2048, "Image URL is too long")
  .refine((value) => getSafeMarkdownUrl(value, "image") !== null, "Image URL must use a safe HTTP(S) scheme");

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().min(3).max(200).optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  coverImageUrl: safeImageUrlSchema.optional().nullable(),
  images: z.array(safeImageUrlSchema).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  linkedTripId: z.string().uuid().optional().nullable(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

export { generateSlug } from "@/lib/utils";
