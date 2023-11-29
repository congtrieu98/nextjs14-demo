import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const feeSchema = z.object({
  id: z.string(),
  content: z.string(),
  userId: z.string(),
})

export interface CompleteFee extends z.infer<typeof feeSchema> {
  user: CompleteUser
}

/**
 * relatedFeeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedFeeSchema: z.ZodSchema<CompleteFee> = z.lazy(() => feeSchema.extend({
  user: relatedUserSchema,
}))
