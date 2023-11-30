import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { postsRouter } from "./posts";
import { feedRouter } from "./feed";
import { mediaRouter } from "./media";
import { usersRouter } from "./users";

export const appRouter = router({
  computers: computersRouter,
  posts: postsRouter,
  feed: feedRouter,
  media: mediaRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
