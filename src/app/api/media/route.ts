import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createMedi,
  deleteMedi,
  updateMedi,
} from "@/lib/api/media/mutations";
import { 
  mediIdSchema,
  insertMediParams,
  updateMediParams 
} from "@/lib/db/schema/media";

export async function POST(req: Request) {
  try {
    const validatedData = insertMediParams.parse(await req.json());
    const { medi, error } = await createMedi(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/media"); // optional - assumes you will have named route same as entity
    return NextResponse.json(medi, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateMediParams.parse(await req.json());
    const validatedParams = mediIdSchema.parse({ id });

    const { medi, error } = await updateMedi(validatedParams.id, validatedData);

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(medi, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = mediIdSchema.parse({ id });
    const { medi, error } = await deleteMedi(validatedParams.id);
    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(medi, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
