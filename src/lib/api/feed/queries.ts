import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type FeeId, feeIdSchema } from "@/lib/db/schema/feed";

export const getFees = async () => {
  const { session } = await getUserAuth();
  // @ts-ignore
  const f = await db.fee.findMany({ where: { userId: session?.user.id! } });
  return { feed: f };
};

export const getFeeById = async (id: FeeId) => {
  const { session } = await getUserAuth();
  const { id: feeId } = feeIdSchema.parse({ id });
  const f = await db.fee.findFirst({
    where: { id: feeId, userId: session?.user.id! }
  });
  return { feed: f };
};

