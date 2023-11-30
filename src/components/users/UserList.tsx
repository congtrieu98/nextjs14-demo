"use client"

import { CompleteUser } from "@/lib/db/schema/users";
import { trpc } from "@/lib/trpc/client";

export default function UserList({ users } : { users: CompleteUser[] }) {
    
const { data: u } = trpc.users.getUsers.useQuery(undefined, {
    initialData: { users },
    refetchOnMount: false,
  });
    return (
        <>
        </>
    )
}