import { db } from "@/lib/db/index";
import { type MediId, mediIdSchema } from "@/lib/db/schema/media";

export const getMedias = async () => {
  // @ts-ignore
  const m = await db.medi.findMany({});
  return { media: m };
};

export const getMediById = async (id: MediId) => {
  const { id: mediId } = mediIdSchema.parse({ id });
  // @ts-ignore
  const m = await db.medi.findFirst({
    where: { id: mediId }
  });
  return { media: m };
};

