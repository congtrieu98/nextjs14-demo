import * as z from "zod"
import { CompleteMedi, RelatedMediSchema, CompleteUser, RelatedUserSchema } from "./index"

export const FeeSchema = z.object({
  id: z.string(),
  content: z.string(),
  userId: z.string(),
})

export interface CompleteFee extends z.infer<typeof FeeSchema> {
  medis: CompleteMedi[]
  user: CompleteUser
}

/**
 * RelatedFeeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedFeeSchema: z.ZodSchema<CompleteFee> = z.lazy(() => FeeSchema.extend({
  medis: RelatedMediSchema.array(),
  user: RelatedUserSchema,
}))
