import * as z from "zod"
import { CompleteUser, RelatedUserSchema } from "./index"

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string().nullish(),
  image: z.string(),
  userId: z.string(),
})

export interface CompletePost extends z.infer<typeof PostSchema> {
  user: CompleteUser
}

/**
 * RelatedPostSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPostSchema: z.ZodSchema<CompletePost> = z.lazy(() => PostSchema.extend({
  user: RelatedUserSchema,
}))
