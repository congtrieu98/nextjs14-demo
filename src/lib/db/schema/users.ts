import { getUsers } from "@/lib/api/users/queries";
import { UserSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";

export const updateUsers = UserSchema;
export const userIdSchema = updateUsers.pick({ id: true });
// this type infers the return from getPosts() - meaning it will include any joins
export type CompleteUser = Awaited<ReturnType<typeof getUsers>>["users"][number];
export type UserId = z.infer<typeof userIdSchema>["id"];