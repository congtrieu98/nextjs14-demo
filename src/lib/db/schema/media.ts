import { mediSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getMedias } from "@/lib/api/media/queries";


// Schema for media - used to validate API requests
export const insertMediSchema = mediSchema.omit({ id: true });

export const insertMediParams = mediSchema.extend({
  feedId: z.coerce.string()
}).omit({ 
  id: true
});

export const updateMediSchema = mediSchema;

export const updateMediParams = updateMediSchema.extend({
  feedId: z.coerce.string()
})

export const mediIdSchema = updateMediSchema.pick({ id: true });

// Types for media - used to type API request params and within Components
export type Medi = z.infer<typeof updateMediSchema>;
export type NewMedi = z.infer<typeof insertMediSchema>;
export type NewMediParams = z.infer<typeof insertMediParams>;
export type UpdateMediParams = z.infer<typeof updateMediParams>;
export type MediId = z.infer<typeof mediIdSchema>["id"];
export type FeedId = z.infer<typeof insertMediParams>["feedId"];
    
// this type infers the return from getMedia() - meaning it will include any joins
export type CompleteMedi = Awaited<ReturnType<typeof getMedias>>["media"][number];

