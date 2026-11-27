import { z } from "zod";

const MAX_IMAGE_URL_LENGTH = 2048;

const singleLineTextSchema = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .refine((value) => !/[\r\n]/.test(value), "Text must be a single line");

const httpUrlSchema = z
  .string()
  .trim()
  .max(MAX_IMAGE_URL_LENGTH, "URL is too long")
  .url("A valid URL is required")
  .refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  }, "URL must use HTTP or HTTPS");

const forumCategorySchema = z.enum([
  "DISCUSSIONS",
  "ROUTE_ADVICE",
  "RECOMMENDATIONS",
  "PACKING_GEAR",
  "LIVE_REPORTS",
  "TEMPLATES",
]);

const forumTagsSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Tags cannot be empty")
      .max(40, "Tags must be 40 characters or fewer")
      .refine((tag) => !/[\r\n]/.test(tag), "Tags cannot contain line breaks")
  )
  .max(10, "You can add up to 10 tags")
  .default([])
  .transform((tags) => [...new Set(tags)]);

const forumImagesSchema = z
  .array(httpUrlSchema)
  .max(4, "You can attach up to 4 images")
  .default([]);

const optionalDestinationSchema = singleLineTextSchema(
  120,
  "Destination must be 120 characters or fewer"
)
  .optional()
  .nullable();

export const createDiscussionSchema = z.object({
  title: singleLineTextSchema(160, "Title must be 160 characters or fewer").min(
    5,
    "Title must be at least 5 characters long."
  ),
  content: z.string().trim().min(10, "Description must be at least 10 characters long.").max(20_000),
  category: forumCategorySchema,
  destination: optionalDestinationSchema,
  tags: forumTagsSchema,
  images: forumImagesSchema,
  linkedTripId: z.string().uuid("Invalid linked trip ID").optional().nullable(),
  coverImageUrl: httpUrlSchema.optional().nullable(),
});

export const updateDiscussionSchema = createDiscussionSchema;

export const forumPostIdSchema = z.string().uuid("Invalid discussion ID");
export const forumReplyIdSchema = z.string().uuid("Invalid reply ID");

export const forumReplySchema = z.object({
  postId: forumPostIdSchema,
  content: z.string().trim().min(2, "Reply cannot be empty.").max(5_000),
});

export const updateForumReplySchema = z.object({
  replyId: forumReplyIdSchema,
  content: z.string().trim().min(2, "Reply cannot be empty.").max(5_000),
});

export const saveTipToTripNoteSchema = z.object({
  tripId: z.string().uuid("Invalid trip ID"),
  tipContent: z.string().trim().min(1, "Tip content is required.").max(5_000),
  sourceTitle: singleLineTextSchema(160, "Source title must be 160 characters or fewer").min(
    1,
    "Source title is required."
  ),
  authorName: singleLineTextSchema(120, "Author name must be 120 characters or fewer").min(
    1,
    "Author name is required."
  ),
});

export type CreateDiscussionData = z.infer<typeof createDiscussionSchema>;
export type UpdateDiscussionData = z.infer<typeof updateDiscussionSchema>;
