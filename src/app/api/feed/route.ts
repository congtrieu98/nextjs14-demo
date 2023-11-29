import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createFee,
  deleteFee,
  updateFee,
} from "@/lib/api/feed/mutations";
import { 
  feeIdSchema,
  insertFeeParams,
  updateFeeParams 
} from "@/lib/db/schema/feed";

export async function POST(req: Request) {
  try {
    const validatedData = insertFeeParams.parse(await req.json());
    const { fee, error } = await createFee(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/feed"); // optional - assumes you will have named route same as entity
    return NextResponse.json(fee, { status: 201 });
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

    const validatedData = updateFeeParams.parse(await req.json());
    const validatedParams = feeIdSchema.parse({ id });

    const { fee, error } = await updateFee(validatedParams.id, validatedData);

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(fee, { status: 200 });
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

    const validatedParams = feeIdSchema.parse({ id });
    const { fee, error } = await deleteFee(validatedParams.id);
    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(fee, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
