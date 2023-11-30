import * as z from "zod"

export const mediSchema = z.object({
  id: z.string(),
  url: z.string().nullish(),
  feedId: z.string(),
})
