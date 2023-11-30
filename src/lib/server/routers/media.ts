import { getMediById, getMedias } from "@/lib/api/media/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  mediIdSchema,
  insertMediParams,
  updateMediParams,
} from "@/lib/db/schema/media";
import { createMedi, deleteMedi, updateMedi } from "@/lib/api/media/mutations";

export const mediaRouter = router({
  getMedia: publicProcedure.query(async () => {
    return getMedias();
  }),
  getMediById: publicProcedure.input(mediIdSchema).query(async ({ input }) => {
    return getMediById(input.id);
  }),
  createMedi: publicProcedure
    .input(insertMediParams)
    .mutation(async ({ input }) => {
      return createMedi(input);
    }),
  updateMedi: publicProcedure
    .input(updateMediParams)
    .mutation(async ({ input }) => {
      return updateMedi(input.id, input);
    }),
  deleteMedi: publicProcedure
    .input(mediIdSchema)
    .mutation(async ({ input }) => {
      return deleteMedi(input.id);
    }),
});
