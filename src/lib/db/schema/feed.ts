import { feeSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getFees } from "@/lib/api/feed/queries";


// Schema for feed - used to validate API requests
export const insertFeeSchema = feeSchema.omit({ id: true });

export const insertFeeParams = feeSchema.extend({
  createAt: z.coerce.date()
}).omit({ 
  id: true,
  userId: true
});

export const updateFeeSchema = feeSchema;

export const updateFeeParams = updateFeeSchema.extend({
  createAt: z.coerce.date()
}).omit({ 
  userId: true
});

export const feeIdSchema = updateFeeSchema.pick({ id: true });

// Types for feed - used to type API request params and within Components
export type Fee = z.infer<typeof updateFeeSchema>;
export type NewFee = z.infer<typeof insertFeeSchema>;
export type NewFeeParams = z.infer<typeof insertFeeParams>;
export type UpdateFeeParams = z.infer<typeof updateFeeParams>;
export type FeeId = z.infer<typeof feeIdSchema>["id"];
    
// this type infers the return from getFeed() - meaning it will include any joins
export type CompleteFee = Awaited<ReturnType<typeof getFees>>["feed"][number];

