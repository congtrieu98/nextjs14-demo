import * as z from "zod"
import { CompleteFee, relatedFeeSchema } from "./index"

export const mediSchema = z.object({
  id: z.string(),
  url: z.string().nullish(),
  feedId: z.string(),
})

export interface CompleteMedi extends z.infer<typeof mediSchema> {
  fee: CompleteFee
}

/**
 * relatedMediSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedMediSchema: z.ZodSchema<CompleteMedi> = z.lazy(() => mediSchema.extend({
  fee: relatedFeeSchema,
}))
