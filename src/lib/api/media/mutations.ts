import { db } from "@/lib/db/index";
import { 
  MediId, 
  NewMediParams,
  UpdateMediParams, 
  updateMediSchema,
  insertMediSchema, 
  mediIdSchema 
} from "@/lib/db/schema/media";

export const createMedi = async (medi: NewMediParams) => {
  const newMedi = insertMediSchema.parse(medi);
  try {
    const m = await db.medi.create({ data: newMedi });
    return { medi: m };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateMedi = async (id: MediId, medi: UpdateMediParams) => {
  const { id: mediId } = mediIdSchema.parse({ id });
  const newMedi = updateMediSchema.parse(medi);
  try {
    const m = await db.medi.update({ where: { id: mediId }, data: newMedi})
    return { medi: m };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteMedi = async (id: MediId) => {
  const { id: mediId } = mediIdSchema.parse({ id });
  try {
    const m = await db.medi.delete({ where: { id: mediId }})
    return { medi: m };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

