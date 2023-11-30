import { db } from "@/lib/db/index";
import { 
  FeeId, 
  NewFeeParams,
  UpdateFeeParams, 
  updateFeeSchema,
  insertFeeSchema, 
  feeIdSchema 
} from "@/lib/db/schema/feed";
import { getUserAuth } from "@/lib/auth/utils";

export const createFee = async (fee: NewFeeParams) => {
  const { session } = await getUserAuth();
  console.log(fee)
  const newFee = insertFeeSchema.parse({ ...fee, userId: session?.user.id! });
  try {
    // @ts-ignore
    const f = await db.fee.create({ data: newFee });
    return { fee: f };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateFee = async (id: FeeId, fee: UpdateFeeParams) => {
  const { session } = await getUserAuth();
  const { id: feeId } = feeIdSchema.parse({ id });
  const newFee = updateFeeSchema.parse({ ...fee, userId: session?.user.id! });
  try {
    // @ts-ignore
    const f = await db.fee.update({ where: { id: feeId, userId: session?.user.id! }, data: newFee})
    return { fee: f };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteFee = async (id: FeeId) => {
  const { session } = await getUserAuth();
  const { id: feeId } = feeIdSchema.parse({ id });
  try {
    // @ts-ignore
    const f = await db.fee.delete({ where: { id: feeId, userId: session?.user.id! }})
    return { fee: f };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

