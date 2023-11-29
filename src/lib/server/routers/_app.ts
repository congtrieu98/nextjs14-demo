import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { postsRouter } from "./posts";
import { feedRouter } from "./feed";
import { mediaRouter } from "./media";

export const appRouter = router({
  computers: computersRouter,
  posts: postsRouter,
  feed: feedRouter,
  media: mediaRouter,
});

export type AppRouter = typeof appRouter;
