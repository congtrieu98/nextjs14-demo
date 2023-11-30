import * as z from "zod"
import { CompleteFee, RelatedFeeSchema } from "./index"

export const MediSchema = z.object({
  id: z.string(),
  url: z.string().nullish(),
  feedId: z.string(),
})

export interface CompleteMedi extends z.infer<typeof MediSchema> {
  fee: CompleteFee
}

/**
 * RelatedMediSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedMediSchema: z.ZodSchema<CompleteMedi> = z.lazy(() => MediSchema.extend({
  fee: RelatedFeeSchema,
}))
