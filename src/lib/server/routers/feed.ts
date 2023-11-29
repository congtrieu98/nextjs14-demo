import { getFeeById, getFees } from "@/lib/api/feed/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  feeIdSchema,
  insertFeeParams,
  updateFeeParams,
} from "@/lib/db/schema/feed";
import { createFee, deleteFee, updateFee } from "@/lib/api/feed/mutations";

export const feedRouter = router({
  getFeed: publicProcedure.query(async () => {
    return getFees();
  }),
  getFeeById: publicProcedure.input(feeIdSchema).query(async ({ input }) => {
    return getFeeById(input.id);
  }),
  createFee: publicProcedure
    .input(insertFeeParams)
    .mutation(async ({ input }) => {
      return createFee(input);
    }),
  updateFee: publicProcedure
    .input(updateFeeParams)
    .mutation(async ({ input }) => {
      return updateFee(input.id, input);
    }),
  deleteFee: publicProcedure
    .input(feeIdSchema)
    .mutation(async ({ input }) => {
      return deleteFee(input.id);
    }),
});
